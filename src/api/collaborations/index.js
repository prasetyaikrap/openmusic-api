import CollaborationsHandler from "./handler.js";
import CollaborationsRoutes from "./route.js";

export default {
  name: "Collaborations API Plugin",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(service, validator);
    server.route(CollaborationsRoutes(collaborationsHandler));
  },
};
