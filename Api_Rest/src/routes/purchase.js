const axios = require('axios');
const Router = require('koa-router');
const { getGeolocation } = require('../helpers/geolocation');
const router = new Router();
const { WebpayPlus, Options, IntegrationCommerceCodes, 
  IntegrationApiKeys, Environment } = require('transbank-sdk');
  const configaxios = {
    // Define tu configuración de axios aquí
  };

  
  router.get('purchase.show', '/perfildata/:userId', async (ctx) => {
    try {
  
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
          ['location', 'location'],
          ['request_id', 'request_id']
        ],
        where: {
          user_id: ctx.params.userId
        }
      });
      console.log(historial);
  
      const validations = await ctx.orm.Validation.findAll({
        where: {
          request_id: historial.map((item) => item.dataValues.request_id)
        }
      });
      console.log(validations);
      const historialWithValidations = historial
      .map((item) => {
        const validation = validations.find((validation) => validation.request_id === item.dataValues.request_id);
        if (validation && validation.valid === true) {
          return {
            ...item.dataValues,
          };
        }
        return null; // Retorna null si no se cumple la condición
      })
      .filter((item) => item);
      console.log(historialWithValidations);
  
      ctx.body = historialWithValidations;
    } catch (error) {
      console.log(error);
      ctx.throw(404);
    }
  });

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

router.post('purchase', '/', async (ctx) => {
  try {
    const bodytosendMqtt = {
      'request_id': ctx.request.body.requestId,
      'group_id': '20',
      'symbol': ctx.request.body.symbol,
      'datetime': new Date().toISOString(),
      'deposit_token': ctx.request.body.deposit_token,
      'quantity': parseFloat(ctx.request.body.amount),
      'seller': 0
    };

    const url = 'http://app_listener:8000/request' 
    const responseMqtt = await axios.post(url, bodytosendMqtt)


    const bodytosendAdmin = {
      'actionName': ctx.request.body.symbol,
      'amount': parseFloat(ctx.request.body.quantity),
    };

    const url_admin = 'http://admin:3000/admin/createExchange' 
    const responseAdmin = await axios.post(url_admin, bodytosendAdmin)


    const amount = ctx.request.body.amount;
    const price = ctx.request.body.price;
    const value = parseInt(amount) * parseFloat(price);

    ctx.status = 200;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});



router.post('purchase', '/test', async (ctx) => {
  try {
    const body = {
      "auction_id": ctx.request.body.auction_id,
      'stock_id': ctx.request.body.symbol,
      'group_id': '1',
      'quantity': parseFloat(ctx.request.body.quantity),
    };

    console.log("checkea")
    console.log(ctx.request.body.symbol)
    console.log(parseFloat(ctx.request.body.quantity))

    const url = 'http://admin:3000/admin/createExchange' 
    
    const responseMqtt = await axios.post(url, body)

    console.log("enviado yapisimaaaaaaaaaa");

    ctx.status = 200;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

router.get('purchase', '/ventas_grupos', async (ctx) => {
  try {
    const url = `http://admin:3000/admin/getExchangesOffersByOthers`; 
    const response = await axios.get(url, configaxios)
    console.log("respuesta");
    console.log(response.data)
    ctx.body = response.data;

  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

router.post('purchase', '/testproposal', async (ctx) => {
  try {
    const body = {
      "auction_id": ctx.request.body.auction_id,
      "proposal_id": ctx.request.body.proposal_id,
      'stock_id': ctx.request.body.symbol,
      'group_id': '1',
      'quantity': parseFloat(ctx.request.body.quantity),
    };

    console.log("checkea")

    const url = 'http://admin:3000/admin/proposeExchange' 
    
    const responseMqtt = await axios.post(url, body)

    console.log("enviado yapisimaaaaaaaaaa");

    ctx.status = 200;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});


router.get('purchase', '/mis_ventas_grupos', async (ctx) => {
  try {
    const url = `http://admin:3000/admin/getMyExchangesOffers`; 
    const response = await axios.get(url, configaxios)
    console.log("respuesta");
    console.log(response.data)
    ctx.body = response.data;

  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

router.get('purchase', '/revisar_propuestas/:auction_id', async (ctx) => {
  try {
    const { auction_id } = ctx.params;
    const url = `http://admin:3000/admin/getExchangesPoposed/${auction_id}`; 
    const response = await axios.get(url, configaxios)
    console.log("respuesta");
    console.log(response.data)
    ctx.body = response.data;

  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

router.post('purchase', '/aceptar_rechazar', async (ctx) => {
  try {
    const body = {
      "auction_id": ctx.request.body.auction_id,
      "proposal_id": ctx.request.body.proposal_id,
      'stock_id': ctx.request.body.stock_id,
      'group_id': '1',
      'quantity': parseFloat(ctx.request.body.quantity),
      'type': ctx.request.body.type,
    };

    console.log("checkea")

    const url = 'http://admin:3000/admin/resultExchange' 
    
    const responseMqtt = await axios.post(url, body)

    console.log("enviado yapisimaaaaaaaaaa");

    ctx.status = 200;
  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});

router.get('purchase', '/admin_ventas', async (ctx) => {
  try {
    const { auction_id } = ctx.params;
    const url = `http://admin:3000/admin/getAdminActions`; 
    const response = await axios.get(url, configaxios)
    console.log("respuesta");
    console.log(response.data)
    ctx.body = response.data;

  } catch (error) {
    console.error('Error en la ruta POST:', error);
    ctx.throw = 500;
    ctx.body = { error: error.message };
  }
});




module.exports = router;