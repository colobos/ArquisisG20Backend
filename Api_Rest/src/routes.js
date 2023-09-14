const Router = require('koa-router');
const broker = require('./routes/broker');
const purchase = require('./routes/purchase');

const router = new Router();

router.use('/stocks', broker.routes());

router.use('/purchase', purchase.routes());

module.exports = router;