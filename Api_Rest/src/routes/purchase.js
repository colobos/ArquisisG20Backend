const axios = require('axios');
const Router = require('koa-router');
const { getGeolocation } = require('../helpers/geolocation');
const router = new Router();
const uuid = require('uuid');
const { WebpayPlus, Options, IntegrationCommerceCodes, 
  IntegrationApiKeys, Environment } = require('transbank-sdk');


router.get('purchase.show', '/perfildata/:userId', async (ctx) => {
  try {

    const historial = await ctx.orm.Purchase.findAll({
      attributes: [
        ['user_id', 'user_id'], 
        ['amount', 'amount'], 
        ['group_id', 'group_id'], 
        ['datetime', 'datetime'], 
        ['stocks_symbol', 'symbol'], 
        ['stocks_shortname', 'shortName'],
        ['country', 'country'], 
        ['city', 'city'], 
        ['location', 'location']
      ],
      where: {
        user_id: ctx.params.userId
      }
    });
    ctx.body = historial;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

router.post('purchase', '/', async (ctx) => {
  try {
    // Adding Webpay logic here
    console.log('developing Webpay implementation...');

    const amount = ctx.request.body.amount
    // const requestId = uuid.v4();

    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    // usage: tx.create(buyOrder, sessionId, amount, returnUrl);
    // no estoy seguro de que poner en butOrder y sessionId
    
    const response = await tx.create('trx-id-g20', 'test-iic2173', amount, process.env?.REDIRECT_URL || 'http://localhost:8000');
    console.log('response:', response);
    
    


    const requestId = uuid.v4();
    const bodytosendMqtt = {
      'request_id': requestId,
      'group_id': '20',
      'symbol': ctx.request.body.symbol,
      'datetime': new Date().toISOString(),
      'deposit_token': '',
      'quantity': parseFloat(ctx.request.body.amount),
      'seller': 0
    };

    const url = 'http://app_listener:8000/request' 
    //console.log(url)
    const responseMqtt = await axios.post(url, bodytosendMqtt)
    //console.log(responseMqtt.data, "response.data")
    
    await delay(500);

    const validation = await ctx.orm.Validation.findOne({
      attributes: [
        ['request_id', 'request_id'], 
        ['group_id', 'group_id'], 
        ['seller', 'seller'], 
        ['valid', 'valid'],
      ],
      where: {
        request_id: requestId
      }
    });

    if (validation) {
      if (validation.valid == true)
      {
        const geoLocationData = await getGeolocation(ctx.request.body.ip);
        const country = geoLocationData.country;
        const city = geoLocationData.city;
        const loc = geoLocationData.loc;
        const purchase = await ctx.orm.Purchase.create({
          user_id: ctx.request.body.user_id,
          amount: ctx.request.body.amount,
          group_id: ctx.request.body.group_id,
          datetime: ctx.request.body.datetime,
          stocks_symbol: ctx.request.body.symbol,
          stocks_shortname: ctx.request.body.shortname,
          country: country,
          city: city,
          location: loc,
        });
      
        // if (purchase) {
        //   console.log('Purchase data:', purchase);
        // }


        const userId = ctx.request.body.user_id;
        const wallet = await ctx.orm.Wallet.findOne({
          where: {
            user_id: userId
          }
        });

        const acction = await ctx.orm.Broker.findOne({
          where: {
            stocks_id: ctx.request.body.group_id,
            stocks_symbol: ctx.request.body.symbol
          }
        });

        var price = acction.stocks_price;
        var purchaseAmount = (parseFloat(price) * parseFloat(ctx.request.body.amount));
    
        if (wallet) {
          const currentBalance = wallet.money;
          var newBalance = parseFloat(currentBalance) - parseFloat(purchaseAmount);
          await wallet.update({ money: newBalance });
        }

        ctx.body = { message: 'Compra creada con éxito', validate: true};
      }
      else {
        ctx.body = { message: 'Compra no logró ser realizada', validate: false};
      }
      ctx.status = 201;
    }
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

module.exports = router;