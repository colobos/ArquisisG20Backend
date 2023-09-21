const Router = require('koa-router');
const { getGeolocation } = require('../helpers/geolocation');
const router = new Router();

router.get('purchase.show', '/perfildata', async (ctx) => {
  try {
    //Obtener el id de la sección...Auth0
    // const session = await ctx.orm.sessions.findByPk(ctx.session.sessionid);
    // const userid = session.userid;

    const historial = await ctx.orm.Purchase.findAll({
      attributes: [
        ['user_id', 'user_id'], 
        ['amount', 'amount'], 
        ['group_id', 'group_id'], 
        ['datetime', 'datetime'], 
        ['stocks_symbol', 'symbol'], 
        ['stocks_shortname', 'shortName'],
        ['country', 'country'], 
        ['city', 'city'], 
        ['location', 'location']
      ]//,
      //where: {
      //  user_id: userid
      //}
    });
    ctx.body = historial;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});

router.post('purchase', '/', async (ctx) => {
  try {
    const geoLocationData = await getGeolocation(ctx.request.body.ip);
    const country = geoLocationData.country;
    const city = geoLocationData.city;
    const loc = geoLocationData.loc;
    const purchase = await ctx.orm.Purchase.create({
      user_id: ctx.request.body.user_id,
      amount: ctx.request.body.amount,
      group_id: ctx.request.body.group_id,
      datetime: ctx.request.body.datetime,
      stocks_symbol: ctx.request.body.symbol,
      stocks_shortname: ctx.request.body.shortname,
      country: country,
      city: city,
      location: loc,
    });
    if (purchase) {
      console.log('Purchase data:', purchase);
    }
    ctx.body = { message: 'Compra creada con éxito' };
    ctx.status = 201;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

module.exports = router;