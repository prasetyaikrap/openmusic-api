// import routes from "./routes.js";
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import Inert from "@hapi/inert";

//Internal Services
import Plugins from "./src/api/index.js";
import Services from "./src/services/index.js";
import Validator from "./src/utils/validator/index.js";
import TokenManager from "./src/utils/tokenize/TokenManager.js";
import ClientError from "./src/exception/ClientError.js";
import { config } from "./src/utils/config/config.js";

const init = async () => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // External Plugin
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  //JWT Authentication Strategy
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: config.jwt.keys,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.maxAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  //Register Internal Plugin
  const {
    albumsService,
    songsService,
    usersService,
    authenticationsService,
    playlistsService,
    collaborationsService,
    producerService,
    storageService,
    cacheService,
  } = Services;
  const {
    AlbumsAPI,
    SongsAPI,
    UsersAPI,
    AuthenticationsAPI,
    PlaylistsAPI,
    CollaborationsAPI,
    ExportsAPI,
    UploadsAPI,
  } = Plugins;
  const {
    AlbumsSchema,
    AuthenticationsSchema,
    CollaborationsSchema,
    PlaylistsSchema,
    SongsSchema,
    UsersSchema,
    ExportsSchema,
    UploadsSchema,
  } = Validator;

  await server.register([
    {
      plugin: AlbumsAPI,
      options: {
        service: {
          albumsService,
          usersService,
          cacheService,
        },
        validator: AlbumsSchema,
      },
    },
    {
      plugin: SongsAPI,
      options: {
        service: {
          songsService,
        },
        validator: SongsSchema,
      },
    },
    {
      plugin: UsersAPI,
      options: {
        service: {
          usersService,
        },
        validator: UsersSchema,
      },
    },
    {
      plugin: PlaylistsAPI,
      options: {
        service: {
          playlistsService,
          songsService,
        },
        validator: PlaylistsSchema,
      },
    },
    {
      plugin: CollaborationsAPI,
      options: {
        service: {
          collaborationsService,
          playlistsService,
          usersService,
        },
        validator: CollaborationsSchema,
      },
    },
    {
      plugin: AuthenticationsAPI,
      options: {
        service: {
          authenticationsService,
          usersService,
        },
        validator: AuthenticationsSchema,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: ExportsAPI,
      options: {
        service: {
          producerService,
          playlistsService,
        },
        validator: ExportsSchema,
      },
    },
    {
      plugin: UploadsAPI,
      options: {
        service: {
          storageService,
          albumsService,
        },
        validator: UploadsSchema,
      },
    },
  ]);

  //Error Handling with Extension
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      // Server ERROR!
      const newResponse = h.response({
        status: "error",
        message: `Internal Server Error. ${response.message}.`,
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  //Start Server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
