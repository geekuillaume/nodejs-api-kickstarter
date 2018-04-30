import * as joi from 'joi';

export const emailAuthInputSchema = joi.object().keys({
  email: joi.string().trim().email().lowercase()
    .required(),
  password: joi.string().required(),
}).options({ stripUnknown: true });

