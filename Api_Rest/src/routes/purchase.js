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
          ['location', 'location'],
          ['request_id', 'request_id']
        ],
        where: {
          user_id: ctx.params.userId
        }
      });
      console.log(historial);
  
      const validations = await ctx.orm.Validation.findAll({
        where: {
          request_id: historial.map((item) => item.dataValues.request_id)
        }
      });
      console.log(validations);
      const historialWithValidations = historial
      .map((item) => {
        const validation = validations.find((validation) => validation.request_id === item.dataValues.request_id);
        if (validation && validation.valid === true) {
          return {
            ...item.dataValues,
          };
        }
        return null; // Retorna null si no se cumple la condición
      })
      .filter((item) => item);
      console.log(historialWithValidations);
  
      ctx.body = historialWithValidations;
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
    const formattedData = ctx.request.body.formattedData;
    console.log(formattedData);
    console.log(ctx.request)

    const purchase = await ctx.orm.Purchase.create({
      amount: formattedData.quantity,
      request_id: formattedData.request_id,
      group_id: formattedData.group_id,
      stocks_symbol: formattedData.symbol,
      stocks_shortname: formattedData.shortname,
      datetime: formattedData.datetime,
      deposit_token: formattedData.deposit_token,
    });	

    if (purchase) {
      console.log('Purchase created successfully data:', purchase);
    }

    // Envía una respuesta
    ctx.body = { message: 'Datos recibidos exitosamente' };
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error en el servidor' };
  }
});

/*

router.post('purchase', '/', async (ctx) => {
  try {
    const bodytosendMqtt = {
      'request_id': ctx.request.body.requestId,
      'group_id': '20',
      'symbol': ctx.request.body.symbol,
      'datetime': new Date().toISOString(),
      'deposit_token': ctx.request.body.deposit_token,
      'quantity': parseFloat(ctx.request.body.amount),
      'seller': 0
    };

    const url = 'http://app_listener:8000/request' 
    const responseMqtt = await axios.post(url, bodytosendMqtt)

    const amount = ctx.request.body.amount;
    const price = ctx.request.body.price;
    const value = parseInt(amount) * parseFloat(price);

    ctx.status = 200;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});
*/





module.exports = router;