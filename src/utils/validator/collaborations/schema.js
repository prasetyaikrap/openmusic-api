import Joi from "joi";

export const PostCollaboratorPayloadSchema = Joi.object({
  playlistId: Joi.string().min(1).max(16).required(),
  userId: Joi.string().min(1).max(21).required(),
});

export const DeleteCollaboratorPayloadSchema = Joi.object({
  playlistId: Joi.string().min(1).max(16).required(),
  userId: Joi.string().min(1).max(21).required(),
});
