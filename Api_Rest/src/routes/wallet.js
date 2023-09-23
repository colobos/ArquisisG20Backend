const Router = require('koa-router');
const router = new Router();

// Get all Wallets
router.get('wallet.show', '/all', async (ctx) => {
  try {
    const wallets = await ctx.orm.Wallet.findAll({
      attributes: [
        ['user_id', 'userId'], 
        ['money', 'money']
      ]
    });
    ctx.body = wallets;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});

// Get a Wallet by userId
router.get('wallet.show', '/:userId', async (ctx) => {
  try {
    const wallets = await ctx.orm.Wallet.findAll({
      attributes: [
        ['user_id', 'userId'], 
        ['money', 'money']
      ],
      where: {
        user_id: ctx.params.userId
      }
    });
    ctx.body = wallets;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});

// Create a Wallet
router.post('wallet.create', '/:userId', async (ctx) => {
  try {
    const wallet = await ctx.orm.Wallet.create({
      user_id: ctx.params.userId,
      money: 0
    });
    if (wallet) {
      console.log('Wallet data:', wallet);
    }
    ctx.body = { message: 'Wallet successfuly created' };
    ctx.status = 201;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

// Update a Wallet
router.patch('wallet.update', '/:userId', async (ctx) => {
  try {
    var added_money = parseFloat(ctx.request.body.money);
    const wallet = await ctx.orm.Wallet.findOne({
      where: {
        user_id: ctx.params.userId
      }
    });
    if (wallet) {
      console.log('Wallet data:', wallet);
      var new_money = parseFloat(wallet.money) + parseFloat(added_money);
      await wallet.update({
        money: new_money
      });
      ctx.body = { message: 'Wallet successfuly updated' };
    }
  } catch (error) {
    console.error('Error en la ruta PATCH:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});




module.exports = router;