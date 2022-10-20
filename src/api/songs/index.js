import SongsHandler from "./handler.js";
import SongsRoutes from "./route.js";

export default {
  name: "Songs API Plugin",
  version: "1.0.2",
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(SongsRoutes(songsHandler));
  },
};
