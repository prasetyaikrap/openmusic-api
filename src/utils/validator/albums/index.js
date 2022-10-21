import { PostAlbumsPayloadSchema } from "./schema.js";
import InvariantError from "../../../exception/InvariantError.js";

export default {
  albumsPayload: (payload) => {
    const validationResult = PostAlbumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
