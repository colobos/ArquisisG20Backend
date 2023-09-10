const Router = require('koa-router');
const broker = require('./routes/broker');

const router = new Router();

router.use('/stocks', broker.routes());

module.exports = router;