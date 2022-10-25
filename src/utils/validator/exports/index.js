import { ExportPayloadSchema } from "./schema.js";
import InvariantError from "../../../exception/InvariantError.js";

export default {
  postExportPlaylistPayload: (payload) => {
    const validationResult = ExportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
