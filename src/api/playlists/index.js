import PlaylistsHandler from "./handler.js";
import PlaylistsRoutes from "./route.js";

export default {
  name: "Playlists API Plugin",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator);
    server.route(PlaylistsRoutes(playlistsHandler));
  },
};
