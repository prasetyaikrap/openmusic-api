import { SongsPayloadSchema } from "./schema.js";
import InvariantError from "../../../exception/InvariantError.js";

export default {
  songsPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
