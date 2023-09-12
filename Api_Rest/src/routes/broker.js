const Router = require('koa-router');
const router = new Router();

router.get('stocks.show', '/', async (ctx) => {
  try {
    const maxDatetime = await ctx.orm.Broker.max('datetime');
    const brokers = await ctx.orm.Broker.findAll({
      attributes: [
        ['stocks_id', 'IdLastUpdateStock'], 
        ['datetime', 'DateTimeLastUpdateStock'], 
        ['stocks_symbol', 'symbol'], 
        ['stocks_shortname', 'shortName'],
        ['stocks_price', 'price'],
        ['stocks_currency', 'currency'],
        ['stocks_source', 'source']  
      ],
      where: { datetime: maxDatetime },
    });
    ctx.body = brokers;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});


router.get('stocks.show', '/:symbol', async (ctx) => {
  try {
    const page = parseInt(ctx.query.page);
    const size = parseInt(ctx.query.size); 
    let brokers;

    if (typeof ctx.query.page === 'undefined') {
      brokers = await ctx.orm.Broker.findAll({
        attributes: [
          ['stocks_id', 'IdLastUpdateStock'], 
          ['datetime', 'DateTimeLastUpdateStock'], 
          ['stocks_symbol', 'symbol'], 
          ['stocks_shortname', 'shortName'],
          ['stocks_price', 'price'],
          ['stocks_currency', 'currency'],
          ['stocks_source', 'source']  
        ],
        where: {
          stocks_symbol: ctx.params.symbol
        }
      });	
    }
    else if  (page === 0){
      brokers = await ctx.orm.Broker.findAll({
        attributes: [
          ['stocks_id', 'IdLastUpdateStock'], 
          ['datetime', 'DateTimeLastUpdateStock'], 
          ['stocks_symbol', 'symbol'], 
          ['stocks_shortname', 'shortName'],
          ['stocks_price', 'price'],
          ['stocks_currency', 'currency'],
          ['stocks_source', 'source']  
        ],
        where: {
          stocks_symbol: ctx.params.symbol
        },
	
        limit: 0,
        offset: 0
      });	
    }
    else {
      brokers = await ctx.orm.Broker.findAll({
        attributes: [
          ['stocks_id', 'IdLastUpdateStock'], 
          ['datetime', 'DateTimeLastUpdateStock'], 
          ['stocks_symbol', 'symbol'], 
          ['stocks_shortname', 'shortName'],
          ['stocks_price', 'price'],
          ['stocks_currency', 'currency'],
          ['stocks_source', 'source']  
        ],
        where: {
          stocks_symbol: ctx.params.symbol
        },
	
        limit: size,
        offset: (page - 1) * size
	
      });	
			
    }
    ctx.body = brokers;
  } catch (error) {
    console.log(error);
    ctx.throw(404);
  }
});

router.post('stocks', '/', async (ctx) => {
  try {
    console.log('Datos recibidos:', ctx.request.body);
    const formattedData = ctx.request.body.formattedData;
    const stockObjects = formattedData.stock;
    console.log('Datos recibidos Objetos:', stockObjects);

    for (const obj of stockObjects) {
      // eslint-disable-next-line no-unused-vars
      const broker = await ctx.orm.Broker.create({
        stocks_id: formattedData.stocks_id,
        datetime: formattedData.datetime,
        stocks_symbol: obj.symbol,
        stocks_shortname: obj.shortName,
        stocks_price: obj.price,
        stocks_currency: obj.currency,
        stocks_source: obj.source
      });			
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