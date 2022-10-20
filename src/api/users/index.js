import UsersHandler from "./handler.js";
import UsersRoutes from "./route.js";

export default {
  name: "Users API Plugin",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const usersHandler = new UsersHandler(service, validator);
    server.route(UsersRoutes(usersHandler));
  },
};
