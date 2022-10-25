// import routes from "./routes.js";
import * as dotenv from "dotenv";
dotenv.config();
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";

//Internal Services
import Plugins from "./src/api/index.js";
import Services from "./src/services/index.js";
import Validator from "./src/utils/validator/index.js";
import TokenManager from "./src/utils/tokenize/TokenManager.js";
import ClientError from "./src/exception/ClientError.js";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
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
  ]);

  //JWT Authentication Strategy
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
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
  } = Services;
  const {
    AlbumsAPI,
    SongsAPI,
    UsersAPI,
    AuthenticationsAPI,
    PlaylistsAPI,
    CollaborationsAPI,
  } = Plugins;
  const {
    AlbumsSchema,
    AuthenticationsSchema,
    CollaborationsSchema,
    PlaylistsSchema,
    SongsSchema,
    UsersSchema,
    ExportsSchema,
  } = Validator;

  await server.register([
    {
      plugin: AlbumsAPI,
      options: {
        service: {
          albumsService,
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
        sevice: {
          producerService,
        },
        validator: ExportsSchema,
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
