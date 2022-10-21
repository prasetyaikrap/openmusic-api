import { UserPayloadSchema } from "./schema.js";
import InvariantError from "../../../exception/InvariantError.js";

export default {
  usersPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
