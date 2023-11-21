const axios = require('axios');
const Router = require('koa-router');



const router = new Router();



// create a customerPurchase
router.post('customer-purchase', '/', async (ctx) => {
  try {
    const customerPurchase = await ctx.orm.CustomerPurchase.create({
      user_id: ctx.request.body.user_id,
      admin_id: ctx.request.body.admin_id,
      amount: ctx.request.body.amount,
      symbol: ctx.request.body.symbol,
      shortName: ctx.request.body.shortName,
      price: ctx.request.body.price,
      created_at: ctx.request.body.created_at,
      updated_at: ctx.request.body.updated_at
    });
    if (customerPurchase) {
      console.log('CustomerPurchase data:', customerPurchase);
    }
    ctx.body = { message: 'CustomerPurchase successfuly created' };
    ctx.status = 201;
  } catch (error) {
    console.error(error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

// get all customer purchases of a user
router.get('customer-purchase.show', '/:userId', async (ctx) => {
  try {
    const customerPurchases = await ctx.orm.CustomerPurchase.findAll({
      attributes: [
        ['user_id', 'userId'],
        ['admin_id', 'adminId'],
        ['amount', 'amount'],
        ['symbol', 'symbol'],
        ['shortName', 'shortName'],
        ['price', 'price'],
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt']
      ],
      where: {
        user_id: ctx.params.userId
      }
    });
    ctx.body = customerPurchases;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
    ctx.body = { error: error.message };
  }
});