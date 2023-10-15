const Router = require('koa-router');
const router = new Router();
const { tx } = require('../utils/trx');
const axios = require('axios');
const { getGeolocation } = require('../helpers/geolocation');


router.post('webpay', '/request', async (ctx) => {
  try {
    // receive purchase data intention from front-end
    const request_id = ctx.request.body.request_id;

    const purchaseData = await ctx.orm.Purchase.findOne({
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
        request_id: request_id
      }
    });
    
    const amount = ctx.request.body.amount;
    const response = tx.create('trx-id-grupo20', request_id, amount, process.env?.REDIRECT_URL || 'http://localhost:3000');
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


router.post('webpay', '/validation', async (ctx) => {
  const url = 'http://app_listener:8000/validation' 
  //console.log(url)

  const { ws_token } = ctx.request.body;
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