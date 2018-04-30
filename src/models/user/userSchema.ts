import * as joi from 'joi';

export const userSchema = joi.object().keys({
  id: joi.string().uuid(),
  email: joi.string().email(),
  active: joi.boolean().notes('A user is active after confirming their email address by clicking the link sent on registration'),
});

