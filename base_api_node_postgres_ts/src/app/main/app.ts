import './bootstrap';

import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import hpp from 'hpp';
import i18n from 'i18n';

// Extend Express Request type
declare module 'express-serve-static-core' {
    interface Request {
        __?: (phrase: string) => string;
    }
}
import middle from './middleware';
import addRouters from './routers';
import logger from '../utils/logger';
import pinoHttp from 'pino-http';

const pinoHttpMiddleware = pinoHttp({ logger: logger });

const app: Express = express();

app.use(pinoHttpMiddleware);

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: __dirname + '/../../locale/error',
    objectNotation: false,
    register: global as any,
    updateFiles: false,
    syncFiles: false
});

const rawBodySaver = function (req: any, res: Response, buffer: Buffer, encoding: string): void {
    if (buffer?.length) {
        req.rawBody = buffer.toString(encoding || 'utf8');
    }
};

app.use(compress());

// CORS configuration
const getCorsOrigin = (): string | string[] => {
    if (!process.env.CORS_ORIGIN) return '*';

    const origins = process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
    return origins.length === 1 ? origins[0] : origins;
};

const corsOptions = {
    origin: getCorsOrigin(),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    maxAge: parseInt(process.env.CORS_MAX_AGE || '86400', 10) // 24 hours
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

const routers: { v1: express.Router } = {
    v1: express.Router()
};

app.set('port', process.env.PORT_SERVER || 3000);
app.use(i18n.init);

app.disable('x-powered-by');

app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());

app.use((req: Request, res: Response, next: NextFunction) => {
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

export default app;

