import ExportsHandler from "./handler.js";
import ExportsRoutes from "./route.js";

export default {
  name: "Exports API Plugin",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportsHandler(service, validator);
    server.route(ExportsRoutes(exportsHandler));
  },
};
