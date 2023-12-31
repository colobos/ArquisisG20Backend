const Router = require('koa-router');
const router = new Router();
const { tx } = require('../utils/trx');
const axios = require('axios');
const { getGeolocation } = require('../helpers/geolocation');
const uuid = require('uuid');
const { getAuth0Data } = require('../helpers/getAuth0Data');
const { sendEmail } = require('../helpers/sendEmail');
const { checkAdminToken } = require('../helpers/checkAdminToken');


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

    const response = await tx.create('trx-id-grupo20', request_id, value_to_pay, process.env?.REDIRECT_URL || 'http://www.arquisis.me/purchase-completed');
    console.log('response:', response);


    const geoLocationData = await getGeolocation(ctx.request.body.ip);
    const country = geoLocationData.country;
    const city = geoLocationData.city;
    const loc = geoLocationData.loc;

    const purchaseData = {
      user_id: ctx.request.body.user_id,
      amount: ctx.request.body.amount,
      request_id: request_id,
      group_id: ctx.request.body.numero_grupo,
      stocks_symbol: ctx.request.body.symbol,
      stocks_shortname: ctx.request.body.shortname,
      datetime: ctx.request.body.datetime,
      price: value_to_pay,
      country: country,
      city: city,
      location: loc,
      deposit_token: response.token,
    };

    const purchase = await ctx.orm.Purchase.create({
      user_id: ctx.request.body.user_id,
      amount: ctx.request.body.amount,
      request_id: request_id,
      group_id: ctx.request.body.numero_grupo,
      stocks_symbol: ctx.request.body.symbol,
      stocks_shortname: ctx.request.body.shortname,
      datetime: ctx.request.body.datetime,
      price: value_to_pay,
      country: country,
      city: city,
      location: loc,
      deposit_token: response.token,
    });

    if (purchase) {
      console.log('Purchase created successfully data:', purchase);
    }

    // response to front-end
    const WebpayData = {
      user_id: ctx.request.body.user_id,
      url: response.url,
      token: response.token,
      purchaseData: purchaseData,
    };

    const bodytosendAdmin = {
      'actionName': ctx.request.body.symbol,
      'amount': parseFloat(ctx.request.body.amount),
      'price': parseInt(price),
      
    };
  
    const url_admin = 'http://admin:3000/admin/purchaseHowAdmin' 
    const responseAdmin = await axios.post(url_admin, bodytosendAdmin)

    // send purchase data to listener
    const url = 'http://app_listener:8000/request'
    const bodytosendMqtt = {
      'request_id': ctx.request.body.requestId,
      'group_id': '20',
      'symbol': ctx.request.body.symbol,
      'datetime': new Date().toISOString(),
      'deposit_token': response.token,
      'quantity': parseFloat(ctx.request.body.amount),
      'seller': 20 // AQUI DEBE IR EL NUMERO DEL GRUPO SI ES ADMIN, PERO NO CACHÉ QUE TOKEN TOMAR
    };
    const responseMqtt = await axios.post(url, bodytosendMqtt)

    ctx.body = WebpayData;
    ctx.status = 200;

  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});




router.post('webpay', '/request_user_normal', async (ctx) => {
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


    const geoLocationData = await getGeolocation(ctx.request.body.ip);
    const country = geoLocationData.country;
    const city = geoLocationData.city;
    const loc = geoLocationData.loc;

    const purchaseData = {
      user_id: ctx.request.body.user_id,
      amount: ctx.request.body.amount,
      request_id: request_id,
      group_id: ctx.request.body.group_id,
      stocks_symbol: ctx.request.body.symbol,
      stocks_shortname: ctx.request.body.shortname,
      datetime: ctx.request.body.datetime,
      price: value_to_pay,
      country: country,
      city: city,
      location: loc,
      deposit_token: response.token,
    };

    const purchase = await ctx.orm.Purchase.create({
      user_id: ctx.request.body.user_id,
      amount: ctx.request.body.amount,
      request_id: request_id,
      group_id: ctx.request.body.group_id,
      stocks_symbol: ctx.request.body.symbol,
      stocks_shortname: ctx.request.body.shortname,
      datetime: ctx.request.body.datetime,
      price: value_to_pay,
      country: country,
      city: city,
      location: loc,
      deposit_token: response.token,
    });

    if (purchase) {
      console.log('Purchase created successfully data:', purchase);
    }

    // response to front-end
    const WebpayData = {
      url: response.url,
      token: response.token,
      purchaseData: purchaseData,
    };


    // send purchase data to listener
    const url = 'http://app_listener:8000/request'
    const bodytosendMqtt = {
      'request_id': ctx.request.body.request_id,
      'group_id': '20',
      'symbol': ctx.request.body.symbol,
      'datetime': new Date().toISOString(),
      'deposit_token': response.token,
      'quantity': parseFloat(ctx.request.body.amount),
      'seller': 0 // AQUI DEBE IR EL NUMERO DEL GRUPO SI ES ADMIN, PERO NO CACHÉ QUE TOKEN TOMAR
    };
    const responseMqtt = await axios.post(url, bodytosendMqtt)

    ctx.body = WebpayData;
    ctx.status = 200;

  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});





router.post('webpay', '/request_noadmin', async (ctx) => {
  try {
    const request_id = uuid.v4();

    const stock = await ctx.orm.Broker.findOne({
      where: {
        stocks_symbol: ctx.request.body.symbol,
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


    const geoLocationData = await getGeolocation(ctx.request.body.ip);
    const country = geoLocationData.country;
    const city = geoLocationData.city;
    const loc = geoLocationData.loc;

    const purchaseData = {
      user_id: ctx.request.body.user_id,
      amount: ctx.request.body.amount,
      request_id: request_id,
      group_id: ctx.request.body.group_id,
      stocks_symbol: ctx.request.body.symbol,
      stocks_shortname: ctx.request.body.shortname,
      datetime: ctx.request.body.datetime,
      price: value_to_pay,
      country: country,
      city: city,
      location: loc,
      deposit_token: response.token,
    };

    const purchase = await ctx.orm.Purchase.create({
      user_id: ctx.request.body.user_id,
      amount: ctx.request.body.amount,
      request_id: request_id,
      group_id: ctx.request.body.group_id,
      stocks_symbol: ctx.request.body.symbol,
      stocks_shortname: ctx.request.body.shortname,
      datetime: ctx.request.body.datetime,
      price: value_to_pay,
      country: country,
      city: city,
      location: loc,
      deposit_token: response.token,
    });

    if (purchase) {
      console.log('Purchase created successfully data:', purchase);
    }

    // response to front-end
    const WebpayData = {
      url: response.url,
      token: response.token,
      purchaseData: purchaseData,
    };

    const bodytosendAdmin = {
      'actionName': ctx.request.body.symbol,
      'amount': parseFloat(ctx.request.body.amount),
      'price': parseInt(price),
      
    };
  
    const url_admin = 'http://admin:3000/admin/purchaseToAdmin' 
    const responseAdmin = await axios.post(url_admin, bodytosendAdmin)

    // send purchase data to listener
    // const url = 'http://app_listener:8000/request'
    /*const bodytosendMqtt = {
      'request_id': ctx.request.body.requestId,
      'group_id': '20',
      'symbol': ctx.request.body.symbol,
      'datetime': new Date().toISOString(),
      'deposit_token': response.token,
      'quantity': parseFloat(ctx.request.body.amount),
      'seller': 0 // AQUI DEBE IR EL NUMERO DEL GRUPO SI ES ADMIN, PERO NO CACHÉ QUE TOKEN TOMAR
    };
    const responseMqtt = await axios.post(url, bodytosendMqtt)
    */
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
  console.log('body:', ctx.request.body);
  const ws_token  = ctx.request.body.token;
  let valid = false;
  let message = '';

  // Caso 1 - Tansacción anulada por el usuario
  if (!ws_token || ws_token == '') {
    console.log('token vacio o no encontrado');
    valid = false;
    ctx.body = {
      message: 'Transaccion anulada por el usuario',
      validation: valid
    };
    const purchaseDataa = await ctx.orm.Purchase.findOne({
      where: {
        user_id: ctx.request.body.user_id,
      },
      order: [['createdAt', 'DESC']], // Ordena por el campo 'createdAt' en orden descendente
    });

    const brokerMsg = {
      'request_id': purchaseDataa.request_id,
      'group_id': purchaseDataa.group_id,
      'seller': 0,
      'valid': valid
    };
  
    const responseMqtt = await axios.post(url, brokerMsg);
    console.log('responseMqtt without token:', responseMqtt);
    ctx.status = 200;
    return;
  }

  // Buscamos la información de la compra
  const purchaseData = await ctx.orm.Purchase.findOne({
    where: {
      deposit_token: ctx.request.body.token,
    },
  });

  // Validamos la compra con la api de webpay
  const confirmedTx = await tx.commit(ws_token);

  // Caso 2 - Tansacción rechazada
  if (confirmedTx.response_code != 0) { 
    // Rechaza la compra
    valid = false;
    message = 'Transaccion ha sido rechazada';
  }

  // Caso 3 - Tansacción aceptada
  if (confirmedTx.response_code == 0) {
    valid = true;
    message = 'Transaccion ha sido aceptada';
  }

  // Guardar validación en la base de datos
  const validationObject = await ctx.orm.Validation.create({
    request_id: purchaseData.request_id,
    valid: valid
  });

  // Enviar validación de compra por email al user
  if (valid && ctx.request.body.email) {
    // const authHeader = ctx.request.headers['authorization'];
    // const auth0Token = authHeader && authHeader.split(' ')[1];
    // const auth0UserData = await getAuth0Data(auth0Token);
    // const userEmail = auth0UserData.email;
    console.log('userEmail:', ctx.request.body.email);
    const msg = `Su compra de ${purchaseData.stocks_symbol} se ha realizado con éxito. Puedes ver los detalles en el historial de acciones compradas.`
    await sendEmail(ctx.request.body.email, 'Compra de acciones validada', msg);

  // Enviar validación a listener
  const brokerMsg = {
    'request_id': purchaseData.request_id,
    'group_id': purchaseData.group_id,
    'seller': 0,
    'valid': valid
  };

  const responseMqtt = await axios.post(url, brokerMsg);
  console.log('responseMqtt:', responseMqtt);
  
  ctx.body = {
    message: message,
    validation: valid,
    purchaseData: purchaseData,
  };
  ctx.status = 201;

  return;
}});

module.exports = router;