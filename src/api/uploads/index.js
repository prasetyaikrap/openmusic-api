import UploadsHandler from "./handler.js";
import UploadsRoutes from "./route.js";

export default {
  name: "Uploads API Plugin",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const uploadsHandler = new UploadsHandler(service, validator);
    server.route(UploadsRoutes(uploadsHandler));
  },
};
