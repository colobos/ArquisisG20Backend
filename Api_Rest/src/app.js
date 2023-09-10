const Koa = require('koa');
const koaBody = require('koa-body');
const KoaLogger = require('koa-logger');
const router = require('./routes');
const orm = require('./models');

const app = new Koa();

app.context.orm = orm;

// Logs requests from the server
app.use(KoaLogger());

// Parse Request Body
app.use(koaBody());

app.use(router.routes());

module.exports = app;
