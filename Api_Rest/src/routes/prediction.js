const Router = require('koa-router');
const router = new Router();

router.get('prediction.show', '/:userId', async (ctx) => {
  try {
    console.log("holaaaaaa");
    const predictions = await ctx.orm.Prediction.findAll({
      attributes: [
        ['user_id', 'user_id'], 
        ['shortname', 'shortname'], 
        ['symbol', 'symbol'], 
        ['prediction_value', 'prediction_value'],
        ['state', 'state'],
        ['amount', 'amount'],
        ['time', 'time'],
        ['precios', 'precios'],
        ['dates', 'dates'],
        ['datesimulation', 'datesimulation']
      ],
      where: {
        user_id: ctx.params.userId
      }
    });
    console.log(predictions);
    ctx.body = predictions;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});


module.exports = router;