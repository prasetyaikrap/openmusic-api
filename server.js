// import routes from "./routes.js";
import * as dotenv from "dotenv";
dotenv.config();
import Hapi from "@hapi/hapi";
import Plugin from "./src/api/index.js";
import Validator from "./src/utils/validator/index.js";
import AlbumsService from "./src/services/postgres/AlbumsService.js";
import SongsService from "./src/services/postgres/SongsService.js";
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

  //Register Plugin
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const { albumsAPI, songsAPI } = Plugin;
  await server.register([
    {
      plugin: albumsAPI,
      options: {
        service: {
          albumsService,
          songsService,
        },
        validator: Validator,
      },
    },
    {
      plugin: songsAPI,
      options: {
        service: {
          songsService,
        },
        validator: Validator,
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
        message: "Internal Server Error. Please try again later",
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  //Start Server
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
