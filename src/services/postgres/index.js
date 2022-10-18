import AlbumsService from "./AlbumsService.js";
import SongsService from "./SongsService.js";
import UsersService from "./UsersService.js";
import AuthenticationsService from "./AuthenticationsService.js";

const Services = {
  albumsService: new AlbumsService(),
  songsService: new SongsService(),
  usersService: new UsersService(),
  authenticationsService: new AuthenticationsService(),
};

export default Services;