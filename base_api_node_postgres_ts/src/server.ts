import app from './app/main/app';
import database from './config/database';
import logger from './app/utils/logger';

const server = app
    .listen(process.env.PORT_SERVER, () => {
        logger.info(`App running at port ${process.env.PORT_SERVER} on ${process.env.NODE_ENV}.`);
    })
    .on('error', function (err: Error) {
        logger.debug(err);
    });

database.connect();

const closeServer = async (server: any): Promise<void> => {
    await server.close(async function closeProcess() {
        await database.close();

        logger.warn('All requests stopped, shutting down');
    });
};

const gracefulShutdownHandler = function gracefulShutdownHandler(signal: string): void {
    logger.warn(`Caught ${signal}, gracefully shutting down`);

    setTimeout(() => {
        logger.warn('Shutting down application');
        closeServer(server);
    }, 0);
};

process.on('SIGINT', gracefulShutdownHandler);
process.on('SIGTERM', gracefulShutdownHandler);
process.on('SIGQUIT', gracefulShutdownHandler);

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error(`App exiting due to an unhandled promise: ${promise} and reason: ${reason}`);
    throw reason;
});

process.on('uncaughtException', (error: Error) => {
    logger.error(`App exiting due to an uncaught exception: ${error}`);
    process.exit(1);
});

export { app, server, closeServer };

