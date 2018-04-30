import * as joi from 'joi';

// this schema is what's accepted by the API when creating/updating a TODO
// If the client add a 'id' or 'creatorId', we strip it on validation with the stripUnknown option
export const todoInputSchema = joi.object().keys({
  name: joi.string().min(1).trim().required(),
  comment: joi.string().trim(),
}).options({ stripUnknown: true });

// And this one is representing what's the API is sending back when requesting for a TODO
// It's mainly used for documentation as we are not validating our object when sending the response
export const todoSchema = todoInputSchema.keys({
  id: joi.string().uuid(),
  creatorId: joi.string().uuid(),
});

// We already defined the model above, we could improve this
export interface Todo {
  id?: string;
  name: string;
  comment: string;
  creatorId?: string;
}

