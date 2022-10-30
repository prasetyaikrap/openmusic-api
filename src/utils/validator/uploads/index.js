import { ImageHeaderSchema } from "./schema.js";
import InvariantError from "../../../exception/InvariantError.js";

export default {
  imageHeaderPayload: (headers) => {
    const validationResult = ImageHeaderSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
