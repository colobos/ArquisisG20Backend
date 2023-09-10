const app = require('./app');
const orm = require('./models');
require('dotenv').config();


orm.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    app.listen(3000, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${3000}`);
      return app;
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));