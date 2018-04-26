import * as joi from 'joi';

export const todoSchema = joi.object().keys({
  id: joi.number(),
  name: joi.string().min(1).trim().required(),
  comment: joi.string().trim(),
  creatorId: joi.number(),
});

// We already defined the model above, we could improve this
export interface Todo {
  id?: number;
  name: string;
  comment: string;
  creatorId?: number;
}

