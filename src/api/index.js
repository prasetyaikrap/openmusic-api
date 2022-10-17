import AlbumsHandler from "./albums/handler.js";
import AlbumsRoutes from "./albums/route.js";
import SongsHandler from "./songs/handler.js";
import SongsRoutes from "./songs/route.js";

const Plugin = {
  albumsAPI: {
    name: "Albums API Plugin",
    version: "1.0.2",
    register: async (server, { service, validator }) => {
      const albumsHandler = new AlbumsHandler(service, validator);
      server.route(AlbumsRoutes(albumsHandler));
    },
  },
  songsAPI: {
    name: "Songs API Plugin",
    version: "1.0.2",
    register: async (server, { service, validator }) => {
      const songsHandler = new SongsHandler(service, validator);
      server.route(SongsRoutes(songsHandler));
    },
  },
};

export default Plugin;
