import dotenv from 'dotenv';

const bootstrap = (environment: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'): void => {
    let environmentVariables: dotenv.DotenvConfigOutput;
    if (environment === 'production') {
        environmentVariables = dotenv.config({ path: '.env/.env' });
    } else if (environment === 'test') {
        environmentVariables = dotenv.config({ path: '.env.test' });
    } else {
        environmentVariables = dotenv.config({ path: '.env.development' });
    }

    if (environmentVariables.error) {
        console.error('Error loading environment variables:', environmentVariables.error);
    }
};

export default bootstrap;

