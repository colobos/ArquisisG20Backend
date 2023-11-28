/** source/server.ts */
import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/index';
import { auth, cors } from './utils/rules';
const orm = require('../db/models'); 
const dotenv = require('dotenv');

dotenv.config();

const router: Express = express();

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
// router.use(cors);
// router.use(auth);

/** Routes */
router.use('/', routes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.API_PORT ?? 3000;

/** Init orm */
orm.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
  })
  .catch((err: any) => console.error('Unable to connect to the database:', err));

  