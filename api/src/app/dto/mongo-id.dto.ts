import * as Joi from '@hapi/joi';
const mongoId =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

export const MongoIdSchema = Joi.string().regex(mongoId);