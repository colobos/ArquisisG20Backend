const Router = require('koa-router');
const router = new Router();
const { WebpayPlus, Options, IntegrationCommerceCodes, 
  IntegrationApiKeys, Environment } = require('transbank-sdk');

// router.post('webpay', '/request', async (ctx) => {
//   try {
    
//     // receive purchase data intention from front-end
//     const request_id = ctx.request.body.request_id;

//     const purchaseData = await ctx.orm.Purchase.findOne({
//       attributes: [
//         ['user_id', 'user_id'],
//         ['amount', 'amount'],
//         ['group_id', 'group_id'],
//         ['datetime', 'datetime'],
//         ['stocks_symbol', 'symbol'],
//         ['stocks_shortname', 'shortName'],
//         ['country', 'country'],
//         ['city', 'city'],
//         ['location', 'location']
//       ],
//       where: {
//         request_id: request_id
//       }
//     });
    
//     const amount = ctx.request.body.amount;
//     const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

//     // usage: tx.create(buyOrder, sessionId, amount, returnUrl);
//     // no estoy seguro de que poner en butOrder y sessionId
//     const response = await tx.create('trx-id-grupo20', request_id, amount, process.env?.REDIRECT_URL || 'http://localhost:8000');
//     console.log('response:', response);

//     // response to front-end
//     const WebpayData = {
//       url: response.url,
//       token: response.token,
//       purchaseData: purchaseData,
//     };
//     ctx.body = WebpayData;
//     ctx.status = 200;

//   } catch (error) {
//     console.error('Error en la ruta POST:', error);
//     ctx.throw = 500;
//     ctx.body = { error: error.message };
//   }
// });

router.post('webpay', '/validation', async (ctx) => {
  
  const url = 'http://app_listener:8000/validation' 
  //console.log(url)

  const { ws_token } = ctx.request.body;
  if (!ws_token || ws_token == "") {
    ctx.body = {
      message: "Transaccion anulada por el usuario"
    };
    bodytosendMqtt = {
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

  if (confirmedTx.response_code != 0) { // Rechaza la compra
    const trx = await db.validation.create({

      request_id: ctx.request.body.request_id,
      group_id: ctx.request.body.group_id,
      seller: 0,
      valid: false
      
    });
    ctx.body = {
      message: "Transaccion ha sido rechazada",
      validation: trx.valid,

    };
    ctx.status = 200;
    const responseMqtt = await axios.post(url, trx)
    return;
  }
  const trx = await db.validation.create({

    request_id: ctx.request.body.request_id,
    group_id: ctx.request.body.group_id,
    seller: 0,
    valid: true
    
  });
  ctx.body = {
    message: "Transaccion ha sido aceptada",
    validation: trx.valid,
  };

  ctx.status = 200;
  const responseMqtt = await axios.post(url, trx)
  return;
});

module.exports = router;