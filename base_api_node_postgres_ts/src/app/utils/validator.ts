import { validate } from 'express-validation';

export default (schema: any) =>
    validate(schema, { context: true, statusCode: 422, keyByField: false }, { abortEarly: false });

