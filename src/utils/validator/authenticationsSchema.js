import Joi from "joi";

export const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().required(),
});

export const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
