const Router = require('koa-router');
const broker = require('./routes/broker');
const purchase = require('./routes/purchase');
const wallet = require('./routes/wallet');
const validation = require('./routes/validation');

const router = new Router();

router.use('/stocks', broker.routes());

router.use('/purchase', purchase.routes());

router.use('/wallet', wallet.routes());

router.use('/validation', validation.routes());

module.exports = router;