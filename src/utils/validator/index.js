import { AlbumsPayloadSchema } from "./albumsSchema.js";
import { SongsPayloadSchema } from "./songsSchema.js";
import { UserPayloadSchema } from "./userSchema.js";
import InvariantError from "../../exception/InvariantError.js";

const Validator = {
  albumsPayload: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  songsPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  usersPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default Validator;
