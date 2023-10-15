const dotenv = require('dotenv');
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();
dotenv.config();

const mqtt = require('mqtt');
const axios = require('axios');

const host = process.env.HOST;
const port = process.env.HOST_PORT;
const topics = ['stocks/info', 'stocks/requests', 'stocks/validation'];
const url = `mqtt://${host}:${port}`;

const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: process.env.CLIENT_ID,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

console.log('HOST:', host);
console.log('Connecting MQTT client...');
const client = mqtt.connect(url, options);

client.on('connect', function () {
  console.log('Connected');
  
  for (const topic of topics) {
    subscribeToTopic(topic);
  }
});

function subscribeToTopic(topic) {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log(`Suscrito al tópico: ${topic}`);
    }
    else {
      console.error(`Error al suscribirse asl tópico: ${topic}`);
    }
  });
}

client.on('message', function (topic, message) {
  console.log(`Mensaje recibido en el tópico: ${topic}`);
  const jsonData = message.toString();
  const parsedData = JSON.parse(jsonData);
  if (topic === 'stocks/info') {
    const formattedData = {
      stock: parsedData.stocks,
      stocks_id: parsedData.stocks_id,
      datetime: parsedData.datetime
    };

    const stocksArray = JSON.parse(formattedData.stock);
    formattedData.stock = stocksArray;

    console.log(stocksArray);

    axios.post('http://app:3000/stocks', { formattedData })
      .then(response => {
        console.log('Respuesta de la API:', response.data);
      })
      .catch(error => {
        console.error('Error al enviar los datos a la API:', error);
      });
  } 
  else if (topic === 'stocks/validation') {
    const formattedData = {
      request_id: parsedData.request_id,
      group_id: parsedData.group_id,
      seller: 0,
      valid: parsedData.valid
    };
    console.log(formattedData)

    axios.post('http://app:3000/validation', { formattedData })
      .then(response => {
        console.log('Respuesta de la API:', response.data);
      })
      .catch(error => {
        console.error('Error al enviar los datos a la API:', error);
      });
  }
})


router.post('/request', async (ctx) => {
  try {
    client.publish('stocks/requests', JSON.stringify(ctx.request.body));;
    ctx.response.body = { message: 'Solicitud procesada correctamente' };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: 'Error en la solicitud' };
  }
});

router.post('/validation', async (ctx) => {
  try {
    client.publish('stocks/validation', JSON.stringify(ctx.request.body));;
    ctx.response.body = { message: 'Solicitud procesada correctamente' };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: 'Error en la solicitud' };
  }
});

// Aplica el middleware de bodyParser
app.use(bodyParser());
app.use(cors());

// Aplica las rutas definidas en el router
app.use(router.routes());
app.use(router.allowedMethods());

// Inicia el servidor HTTP
app.listen(8000, () => {
  console.log(`Servidor HTTP escuchando en el puerto 8000`);
});