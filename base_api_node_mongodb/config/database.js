const mongoose = require('mongoose');
const logger = require('../app/utils/logger');

const connect = async () => {
    mongoose.set('debug', Boolean(process.env.MONGO_DEBUG));
    mongoose.set('strictQuery', false);
    const mongoUrl = process.env.DB_URL;
    if (!mongoUrl) throw Error(`Invalid DB_URL. Informed DB_URL:${mongoUrl}`);

    await mongoose.connect(mongoUrl);

    mongoose.connection
        .on('connected', () => {
            logger.info(`Database connected: ${mongoUrl}`);
        })
        .on('error', () => {
            logger.error(`Unable to connect to the database:`, error);
        });
};

const close = () => mongoose.connection.close();

module.exports = {
    connect,
    close
};
