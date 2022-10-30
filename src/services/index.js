import path from "path";
import AlbumsService from "./postgres/AlbumsService.js";
import SongsService from "./postgres/SongsService.js";
import UsersService from "./postgres/UsersService.js";
import PlaylistsService from "./postgres/PlaylistsService.js";
import AuthenticationsService from "./postgres/AuthenticationsService.js";
import CollaborationsService from "./postgres/CollaborationsService.js";
import ProducerService from "./rabbitmq/ProducerService.js";
import StorageService from "./storage/StorageService.js";
import CacheService from "./redis/CacheService.js";

const __dirname = process.cwd();

const Services = {
  albumsService: new AlbumsService(),
  songsService: new SongsService(),
  usersService: new UsersService(),
  authenticationsService: new AuthenticationsService(),
  playlistsService: new PlaylistsService(),
  collaborationsService: new CollaborationsService(),
  producerService: ProducerService,
  storageService: new StorageService(path.resolve(__dirname, "src/uploads")),
  cacheService: new CacheService(),
};

export default Services;
