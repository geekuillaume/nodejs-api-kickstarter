import * as joi from 'joi';

export const todoSchema = joi.object().keys({
  id: joi.string().uuid().strip(),
  name: joi.string().min(1).trim().required(),
  comment: joi.string().trim(),
  // we are stripping this because only the backend should handle the creator of a todo
  creatorId: joi.string().uuid().strip(),
});

// We already defined the model above, we could improve this
export interface Todo {
  id?: string;
  name: string;
  comment: string;
  creatorId?: string;
}

