import { Sequelize } from 'sequelize';
import logger from '../app/utils/logger';

let sequelize: Sequelize | null = null;

interface DbConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    dialect: string;
    logging: boolean | ((msg: string) => void);
    pool: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
    define: {
        timestamps: boolean;
        underscored: boolean;
        underscoredAll: boolean;
        freezeTableName: boolean;
    };
}

const connect = async (): Promise<void> => {
    const dbConfig: DbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || '',
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        dialect: 'postgres',
        logging: process.env.DB_DEBUG === 'true' ? (msg: string) => logger.info(msg) : false,
        pool: {
            max: parseInt(process.env.DB_POOL_MAX || '5', 10),
            min: parseInt(process.env.DB_POOL_MIN || '0', 10),
            acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
            idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10)
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

const close = async (): Promise<void> => {
    if (sequelize) {
        await sequelize.close();
        logger.info('Database connection closed');
    }
};

const getSequelize = (): Sequelize => {
    if (!sequelize) {
        throw new Error('Database not connected. Call connect() first.');
    }
    return sequelize;
};

export default {
    connect,
    close,
    getSequelize
};

