const Router = require('koa-router');
const { getGeolocation } = require('../helpers/geolocation');
const router = new Router();

// TODO: Endpoint to create a purchase
router.post('purchase', '/', async (ctx) => {
  try {
    console.log(ctx.request.body);
    const geoLocationData = await getGeolocation(ctx.request.body.ip);
    console.log(geoLocationData);
    const country = geoLocationData.country;
    const city = geoLocationData.city;
    const loc = geoLocationData.loc;

    // Datos a insertar en BDD
    const purchaseData = {
      user_id: ctx.request.body.user_id,
      symbol: ctx.request.body.symbol,
      group_id: ctx.request.body.group_id,
      amount: ctx.request.body.amount,
      date: ctx.request.body.date,
      country: country,
      city: city,
      location: loc,
    };
    console.log(purchaseData);

    // TODO: Interact with DB here. Hay que crear el modelo de Purchase

    ctx.body = { message: 'Compra creada con éxito' };
    ctx.status = 201;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

module.exports = router;