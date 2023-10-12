const Router = require('koa-router');
const router = new Router();
const { WebpayPlus, Options, IntegrationCommerceCodes, 
  IntegrationApiKeys, Environment } = require('transbank-sdk');

router.post('webpay', '/request', async (ctx) => {
  try {
    
    // receive purchase data intention from front-end
    const purchaseData = {
      user_id: ctx.request.body.user_id,
      group_id: ctx.request.body.group_id,
      symbol: ctx.request.body.symbol,
      shortname: ctx.request.body.shortname,
      amount: ctx.request.body.amount,
      datetime: ctx.request.body.datetime,
      ip: ctx.request.body.ip,
    };
    
    const amount = ctx.request.body.amount;
    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

    // usage: tx.create(buyOrder, sessionId, amount, returnUrl);
    // no estoy seguro de que poner en butOrder y sessionId
    const response = await tx.create('trx-id-grupo20', 'test-iic2173', amount, process.env?.REDIRECT_URL || 'http://localhost:8000');
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