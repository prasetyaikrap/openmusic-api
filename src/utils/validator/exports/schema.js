import Joi from "joi";

export const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});
