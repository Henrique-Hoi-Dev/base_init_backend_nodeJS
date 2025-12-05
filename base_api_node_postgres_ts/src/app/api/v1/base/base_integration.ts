import axios, { AxiosInstance } from 'axios';
import logger from '../../../utils/logger';

const EXTERNAL_SERVICES: { [key: string]: string } = {};

class BaseIntegration {
    protected serviceName: string;
    protected externalServices: { [key: string]: string };
    protected logger: typeof logger;
    protected httpClient: AxiosInstance;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.externalServices = EXTERNAL_SERVICES;
        this.logger = logger;

        this.httpClient = axios.create({
            baseURL: this.externalServices[this.serviceName]
        });

        this.httpClient.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                logger.debug(error);
                const err: any = new Error(`INTEGRATION_ERROR`);
                err.key = 'INTEGRATION_ERROR';
                err.status = error?.response?.status ?? 400;
                err.errors = error.response;

                err.response = error.response;
                err.config = error.config;

                return Promise.reject(err);
            }
        );
    }
}

export default BaseIntegration;

