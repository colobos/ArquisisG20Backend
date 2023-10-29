const Router = require('koa-router');
const router = new Router();

router.get('prediction.show', '/:userId', async (ctx) => {
  try {
    console.log("holaaaaaa");
    const predictions = await ctx.orm.Prediction.findAll({
      attributes: [
        ['id', 'id'], 
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


router.post('prediction.show', '/request', async (ctx) => {
  try {
    const formattedData = ctx.request.body;
    console.log("Información");

    /* 
    Ejemplo de lo que entrega formattedData:
      {
        user_id: '653db29818d81877fbb0590d',
        symbol: 'AMZN',
        group_id: '72daf6d3-a30e-4dcb-97a9-922d8800cc6c',
        amount: '777',
        time: '777',
        shortname: 'Amazon.com, Inc.'
      }

    */

   /*Enviar información a Worker*/


    console.log(formattedData);
    ctx.body = { message: 'Predicción enviada exitosamente' };

  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});


module.exports = router;