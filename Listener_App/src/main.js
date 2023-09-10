const dotenv = require('dotenv');
dotenv.config();

const mqtt = require('mqtt')
const axios = require('axios');

const host = process.env.HOST; 
const port = process.env.HOST_PORT; 
const topic = 'stocks/info'; 
const url = `mqtt://${host}:${port}`;

const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: process.env.CLIENT_ID,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
}
const client  = mqtt.connect(url, options)
client.on('connect', function () {
  console.log('Connected')
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log(`Suscrito al tópico: ${topic}`);
    }
  })
})

client.on('message', function (topic, message) {
  const jsonData = message.toString();
  const parsedData = JSON.parse(jsonData);

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
})