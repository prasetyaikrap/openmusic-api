import AlbumsService from "./AlbumsService.js";
import SongsService from "./SongsService.js";
import UsersService from "./UsersService.js";

const Services = {
  albumsService: new AlbumsService(),
  songsService: new SongsService(),
  usersService: new UsersService(),
};

export default Services;
