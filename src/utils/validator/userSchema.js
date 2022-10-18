import Joi from "joi";

export const UserPayloadSchema = Joi.object({
  username: Joi.string().min(5).max(20).required(),
  password: Joi.string().required(),
  fullname: Joi.string().min(5).max(100).required(),
});
