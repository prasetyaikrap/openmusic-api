import AlbumsHandler from "./handler.js";
import AlbumsRoutes from "./route.js";

export default {
  name: "Albums API Plugin",
  version: "1.0.2",
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    server.route(AlbumsRoutes(albumsHandler));
  },
};
