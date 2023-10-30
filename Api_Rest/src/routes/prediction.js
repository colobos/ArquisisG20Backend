const Router = require('koa-router');
const router = new Router();
const axios = require('axios');

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
    const data = {
      user_id: ctx.request.body.user_id,
      group_id: ctx.request.body.group_id,
      symbol: ctx.request.body.symbol,
      time: ctx.request.body.time,
      amount: ctx.request.body.amount,
      shortname: ctx.request.body.shortname
    };

    console.log("Información");

    axios.post('http://jobmaster:9000/job', data)
    .then(response => {
      console.log('Respuesta del jobMaster:', response.data);
    })
    .catch(error => {
      console.error('Error al enviar los datos al jobMaster:', error);
    });

    console.log(data);
    ctx.body = { message: 'Predicción enviada exitosamente' };

  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});


module.exports = router;