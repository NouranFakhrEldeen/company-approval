import * as Joi from '@hapi/joi';

export const IdGeneralSchema = Joi.alternatives().try(
    Joi.string().valid('general'),
    Joi.string().guid()
)