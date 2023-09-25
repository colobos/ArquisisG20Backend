const Router = require('koa-router');
const router = new Router();

router.get('validations.show', '/', async (ctx) => {
  try {
    const validations = await ctx.orm.Validation.findAll({
      attributes: [
        ['request_id', 'request_id'], 
        ['group_id', 'group_id'], 
        ['seller', 'seller'], 
        ['valid', 'valid'],
      ],
    });
    ctx.body = validations;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});

router.post('validation', '/', async (ctx) => {
  try {
    console.log('Datos recibidos:', ctx.request.body);
    const formattedData = ctx.request.body.formattedData;

    if (formattedData.group_id == 20) {
        const validation = await ctx.orm.Validation.create({
            request_id: formattedData.request_id,
            group_id: formattedData.group_id,
            seller: formattedData.seller,
            valid: formattedData.valid,
        });			
        console.log(validation);
    }


    // Envía una respuesta
    ctx.body = { message: 'Datos recibidos exitosamente' };
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error en el servidor' };
  }
});


module.exports = router;