import Joi from "joi";

export const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  year: Joi.number().required(),
});
