import * as Joi from '@hapi/joi';

export const IdSchema = Joi.string().guid()