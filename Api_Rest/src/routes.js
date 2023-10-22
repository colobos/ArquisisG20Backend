const Router = require('koa-router');
const broker = require('./routes/broker');
const purchase = require('./routes/purchase');
const wallet = require('./routes/wallet');
const validation = require('./routes/validation');
const webpay = require('./routes/webpay');

const router = new Router();

router.use('/stocks', broker.routes());

router.use('/purchase', purchase.routes());

router.use('/wallet', wallet.routes());

router.use('/validation', validation.routes());

router.use('/webpay', webpay.routes());

module.exports = router;