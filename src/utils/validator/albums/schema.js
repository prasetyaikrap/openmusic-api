import Joi from "joi";

export const PostAlbumsPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  year: Joi.number().required(),
});

export const PostAlbumCoverPayload = Joi.object({
  cover: Joi.allow(),
});
