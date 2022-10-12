import Joi from "joi";

export const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});
