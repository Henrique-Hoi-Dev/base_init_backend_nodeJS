const { Sequelize } = require('sequelize');
const logger = require('../app/utils/logger');

let sequelize = null;

const connect = async () => {
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: 'postgres',
        logging: process.env.DB_DEBUG === 'true' ? (msg) => logger.info(msg) : false,
        pool: {
            max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
            min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
            acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
            idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
            freezeTableName: false
        }
    };

    if (!dbConfig.database || !dbConfig.username || !dbConfig.password) {
        throw new Error('Invalid database configuration. DB_NAME, DB_USER and DB_PASSWORD are required.');
    }

    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
        define: dbConfig.define
    });

    try {
        await sequelize.authenticate();
        logger.info(`Database connected: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        throw error;
    }
};

const close = async () => {
    if (sequelize) {
        await sequelize.close();
        logger.info('Database connection closed');
    }
};

const getSequelize = () => {
    if (!sequelize) {
        throw new Error('Database not connected. Call connect() first.');
    }
    return sequelize;
};

module.exports = {
    connect,
    close,
    getSequelize
};
