require('./bootstrap')();

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const hpp = require('hpp');
const i18n = require('i18n');
const middle = require('./middleware');
const addRouters = require('./routers');
const mongoosePaginate = require('mongoose-paginate-v2');
const logger = require('../utils/logger');
const pinoHttp = require('pino-http')({ logger: logger });

const app = express();

app.use(pinoHttp);

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 20
};

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: __dirname + '/../../locale/error',
    objectNotation: false,
    register: global,
    updateFiles: false,
    syncFiles: false
});

const rawBodySaver = function (req, res, buffer, encoding) {
    if (buffer?.length) {
        req.rawBody = buffer.toString(encoding || 'utf8');
    }
};

app.use(compress());

// CORS configuration
const getCorsOrigin = () => {
    if (!process.env.CORS_ORIGIN) return '*';
    
    const origins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
    return origins.length === 1 ? origins[0] : origins;
};

const corsOptions = {
    origin: getCorsOrigin(),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    maxAge: parseInt(process.env.CORS_MAX_AGE, 10) || 86400 // 24 hours
};

app.use(cors(corsOptions));

app.use(
    bodyParser.json({
        limit: '50mb',
        verify: rawBodySaver
    })
);
app.use(
    bodyParser.urlencoded({
        verify: rawBodySaver,
        limit: '50mb',
        extended: true
    })
);

app.use(
    hpp({
        whitelist: []
    })
);

const routers = {};
routers.v1 = express.Router();

app.set('port', process.env.PORT_SERVER || 3000);
app.use(i18n.init);

app.disable('x-powered-by');

app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());

app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('Content-Security-Policy', "frame-ancestors 'none'");

    return next();
});

app.use('/v1/', routers.v1);
app.use('/', routers.v1);

app.use(middle.throw404);

app.use(middle.logError);
app.use(middle.handleError);

addRouters(routers.v1);

module.exports = app;
