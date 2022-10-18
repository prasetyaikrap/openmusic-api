import AlbumsHandler from "./albums/handler.js";
import AlbumsRoutes from "./albums/route.js";
import AuthenticationsHandler from "./authentications/handler.js";
import AuthenticationsRoutes from "./authentications/route.js";
import SongsHandler from "./songs/handler.js";
import SongsRoutes from "./songs/route.js";
import UsersHandler from "./users/handler.js";
import UsersRoutes from "./users/route.js";

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
  usersAPI: {
    name: "Users API Plugin",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
      const usersHandler = new UsersHandler(service, validator);
      server.route(UsersRoutes(usersHandler));
    },
  },
  authenticationsAPI: {
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
  },
};

export default Plugin;
