require('./bootstrap')();

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const hpp = require('hpp');
const session = require('express-session');
const i18n = require('i18n');
const middle = require('./middleware');
const addRouters = require('./routers');
const mongoosePaginate = require('mongoose-paginate-v2');
const logger = require('../utils/logger');
const pinoHttp = require('pino-http')({ logger: logger });
const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH']
});

const memoryStore = new session.MemoryStore();

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
app.use(cors());
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

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
);

app.use(cookieParser());
app.use(csrfProtection);

app.use('/v1/', routers.v1);
app.use('/', routers.v1);

app.use(middle.throw404);

app.use(middle.logError);
app.use(middle.handleError);

addRouters(routers.v1);

module.exports = app;
