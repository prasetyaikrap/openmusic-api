import Joi from "joi";

export const SongsPayloadSchema = Joi.object({
  title: Joi.string().min(1).max(50).required(),
  year: Joi.number().required(),
  genre: Joi.string().min(1).max(30).required(),
  performer: Joi.string().min(1).max(50).required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});
