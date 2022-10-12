// import routes from "./routes.js";
import * as dotenv from "dotenv";
dotenv.config();
import Hapi from "@hapi/hapi";
import openMusic from "./src/api/openMusic/index.js";
import Validator from "./src/utils/validator/index.js";
import AlbumsService from "./src/services/postgres/AlbumsService.js";
import SongsService from "./src/services/postgres/SongsService.js";

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: openMusic,
    options: {
      service: {
        albumsService,
        songsService,
      },
      validator: Validator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
