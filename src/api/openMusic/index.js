import { AlbumsHandler, SongsHandler } from "./handler.js";
import { albumsRoutes, songsRoutes } from "./route.js";

export default {
  name: "Open Music",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumsHandler(service, validator);
    const songsHandler = new SongsHandler(service, validator);
    server.route(albumsRoutes(albumHandler));
    server.route(songsRoutes(songsHandler));
  },
};
