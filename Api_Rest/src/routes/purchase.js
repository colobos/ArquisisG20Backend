const axios = require('axios');
const Router = require('koa-router');
const { getGeolocation } = require('../helpers/geolocation');
const router = new Router();
const uuid = require('uuid');


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

    const requestId = uuid.v4();
    const bodytosendMqtt = {
      "request_id": requestId,
      "group_id": "20",
      "symbol": ctx.request.body.symbol,
      "datetime": new Date().toISOString(),
      "deposit_token": "",
      "quantity": parseFloat(ctx.request.body.amount),
      "seller": 0
    };

    const url = `http://app_listener:8000/request` 
    //console.log(url)
    const responseMqtt = await axios.post(url, bodytosendMqtt)
    //console.log(responseMqtt.data, "response.data")

    const amount = ctx.request.body.amount;
    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

    // usage: tx.create(buyOrder, sessionId, amount, returnUrl);
    // no estoy seguro de que poner en butOrder y sessionId
    const response = await tx.create('trx-id-grupo20', request_id, amount, process.env?.REDIRECT_URL || 'http://localhost:3000');
    console.log('response:', response);

    // response to front-end
    const WebpayData = {
      url: response.url,
      token: response.token,
      purchaseData: purchaseData,
    };
    ctx.body = WebpayData;
    ctx.status = 200;
    
    
 
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});





module.exports = router;