const Router = require('koa-router');
const router = new Router();

// TODO: Endpoint to create a purchase
// eslint-disable-next-line require-await
router.post('purchase.create', '/', async (ctx) => {
  try {
    console.log(ctx.request.body);
  } catch (error) {
    console.error(error);
  }
});