import AlbumsAPI from "./albums/index.js";
import SongsAPI from "./songs/index.js";
import UsersAPI from "./users/index.js";
import PlaylistsAPI from "./playlists/index.js";
import AuthenticationsAPI from "./authentications/index.js";
import CollaborationsAPI from "./collaborations/index.js";
import ExportsAPI from "./exports/index.js";
import UploadsAPI from "./uploads/index.js";

const Plugins = {
  AlbumsAPI,
  SongsAPI,
  UsersAPI,
  PlaylistsAPI,
  AuthenticationsAPI,
  CollaborationsAPI,
  ExportsAPI,
  UploadsAPI,
};

export default Plugins;
