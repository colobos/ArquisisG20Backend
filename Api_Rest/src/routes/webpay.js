const Router = require('koa-router');
const router = new Router();
const { tx } = require('../utils/trx');
const axios = require('axios');
const { getGeolocation } = require('../helpers/geolocation');
const uuid = require('uuid');


router.post('webpay', '/request', async (ctx) => {
  try {
    const request_id = uuid.v4();
    // receive purchase data intention from front-end

    const stock = await ctx.orm.Broker.findOne({
      where: {
        stocks_symbol: ctx.request.body.symbol,
        stocks_id: ctx.request.body.group_id,
      },
    });

    const price = stock.stocks_price;

    const amount = ctx.request.body.amount;
    const parsedAmount = parseInt(amount);
    const value_to_pay = parsedAmount * parseInt(price);

    
    console.log('last Price of the Stock:', price);

    console.log('Value:', value_to_pay);

    const response = await tx.create('trx-id-grupo20', request_id, value_to_pay, process.env?.REDIRECT_URL || 'http://localhost:3001/purchase-completed');
    console.log('response:', response);


    const purchaseData = {
      request_id: request_id,
      group_id: ctx.request.body.group_id,
      symbol: ctx.request.body.symbol,
      shortname: ctx.request.body.shortname,
      datetime: ctx.request.body.datetime,
      quantity: ctx.request.body.amount,
      price: value_to_pay,
      ip: ctx.request.body.ip,
      seller: 0,
    };

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


router.post('webpay', '/validation', async (ctx) => {
  const url = 'http://app_listener:8000/validation' 
  //console.log(url)

  const { ws_token } = ctx.request.body.token;
  if (!ws_token || ws_token == '') {
    ctx.body = {
      message: 'Transaccion anulada por el usuario'
    };
    const bodytosendMqtt = {
      'request_id': ctx.request.body.request_id,
      'group_id': ctx.request.body.group_id,
      'seller': 0,
      'valid': false
    };
    ctx.status = 200;
    const responseMqtt = await axios.post(url, bodytosendMqtt)
    return;
  }

  const confirmedTx = await tx.commit(ws_token);

  if (confirmedTx.response_code != 0) { 
    // Rechaza la compra
    ctx.body = {
      message: 'Transaccion ha sido rechazada',
      validation: tx.valid,
    };
    ctx.status = 500;
    const responseMqtt = await axios.post(url, tx)
    return;
  }

  // Acepta la compra
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

  if (purchase) {
    console.log('Purchase data:', purchase);
  }

  ctx.body = {
    message: 'Transaccion ha sido aceptada',
    validation: tx.valid,
  };

  ctx.status = 201;
  const responseMqtt = await axios.post(url, tx)
  return;
});

module.exports = router;