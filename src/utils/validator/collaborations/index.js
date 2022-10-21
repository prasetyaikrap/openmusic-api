import {
  PostCollaboratorPayloadSchema,
  DeleteCollaboratorPayloadSchema,
} from "./schema.js";
import InvariantError from "../../../exception/InvariantError.js";

export default {
  postCollaboratorPayload: (payload) => {
    const validationResult = PostCollaboratorPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  deleteCollaboratorPayload: (payload) => {
    const validationResult = DeleteCollaboratorPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
