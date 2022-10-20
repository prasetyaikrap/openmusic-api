// import routes from "./routes.js";
import * as dotenv from "dotenv";
dotenv.config();
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";

//Internal Services
import Plugins from "./src/api/index.js";
import Services from "./src/services/postgres/index.js";
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

  //Register Plugin
  const {
    albumsService,
    songsService,
    usersService,
    authenticationsService,
    playlistsService,
  } = Services;
  const { AlbumsAPI, SongsAPI, UsersAPI, AuthenticationsAPI, PlaylistsAPI } =
    Plugins;
  const {
    albumsPayload,
    songsPayload,
    usersPayload,
    postAuthenticationPayload,
    putAuthenticationPayload,
    deleteAuthenticationPayload,
    postPlaylistPayload,
    putPlaylistPayload,
    postPlaylistSongPayload,
    deletePlaylistSongPayload,
  } = Validator;
  //Internal Plugin
  await server.register([
    {
      plugin: AlbumsAPI,
      options: {
        service: {
          albumsService,
        },
        validator: {
          albumsPayload,
        },
      },
    },
    {
      plugin: SongsAPI,
      options: {
        service: {
          songsService,
        },
        validator: {
          songsPayload,
        },
      },
    },
    {
      plugin: UsersAPI,
      options: {
        service: {
          usersService,
        },
        validator: {
          usersPayload,
        },
      },
    },
    {
      plugin: PlaylistsAPI,
      options: {
        service: {
          playlistsService,
        },
        validator: {
          postPlaylistPayload,
          putPlaylistPayload,
          postPlaylistSongPayload,
          deletePlaylistSongPayload,
        },
      },
    },
    {
      plugin: AuthenticationsAPI,
      options: {
        service: {
          authenticationsService,
          usersService,
        },
        validator: {
          postAuthenticationPayload,
          putAuthenticationPayload,
          deleteAuthenticationPayload,
        },
        tokenManager: TokenManager,
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
        console.log(response);
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
      console.log(response);
      return newResponse;
    }
    return h.continue;
  });

  //Start Server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
