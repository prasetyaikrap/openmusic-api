import Joi from "joi";

export const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});
export const PutPlaylistPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});
export const PostPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
export const DeletePlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
