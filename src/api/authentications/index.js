import AuthenticationsHandler from "./handler.js";
import AuthenticationsRoutes from "./route.js";

export default {
  name: "Authentication API Plugin",
  version: "1.0.0",
  register: async (server, { service, validator, tokenManager }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      service,
      validator,
      tokenManager
    );
    server.route(AuthenticationsRoutes(authenticationsHandler));
  },
};
