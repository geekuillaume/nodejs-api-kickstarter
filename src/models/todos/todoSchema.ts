import * as joi from 'joi';

export const todoSchema = joi.object().keys({
  id: joi.string().uuid().forbidden(),
  name: joi.string().min(1).trim().required(),
  comment: joi.string().trim(),
  // we are forbiding this because only the backend should handle the creator of a todo
  creatorId: joi.string().uuid().forbidden(),
});

// We already defined the model above, we could improve this
export interface Todo {
  id?: string;
  name: string;
  comment: string;
  creatorId?: string;
}

