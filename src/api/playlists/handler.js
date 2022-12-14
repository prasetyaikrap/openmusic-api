export default class PlaylistsHandler {
  constructor(service, validator) {
    this._playlistsService = service.playlistsService;
    this._songsService = service.songsService;
    this._postPlaylistPayload = validator.postPlaylistPayload;
    this._putPlaylistPayload = validator.putPlaylistPayload;
    this._postPlaylistSongPayload = validator.postPlaylistSongPayload;
    this._deletePlaylistSongPayload = validator.deletePlaylistSongPayload;
  }

  async postPlaylistHandler(request, h) {
    this._postPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;
    const playlistId = await this._playlistsService.addPlaylist(credentialId, {
      name,
    });
    const response = h.response({
      status: "success",
      message: "Playlist added successfully",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    const response = h.response({
      status: "success",
      message: `Playlists record found${
        playlists.length == 0 && " with empty lists"
      }`,
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async postSongToPlaylistHandler(request, h) {
    this._postPlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._playlistsService.verifyPlaylistEditor(credentialId, playlistId);
    await this._songsService.verifySong(songId);
    await this._playlistsService.addSongToPlaylist(playlistId, { songId });
    await this._playlistsService.addPlaylistActivites(
      credentialId,
      playlistId,
      { songId },
      "add"
    );
    const response = h.response({
      status: "success",
      message: "Songs added to playlist successfuly",
    });
    response.code(201);
    return response;
  }

  async getPlaylistDetailsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistEditor(credentialId, playlistId);
    const playlist = await this._playlistsService.getPlaylistById(
      credentialId,
      playlistId
    );
    const response = h.response({
      status: "success",
      message: "Playlists record found",
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this._deletePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._playlistsService.verifyPlaylistEditor(credentialId, playlistId);
    await this._playlistsService.deleteSongFromPlaylist(playlistId, { songId });
    await this._playlistsService.addPlaylistActivites(
      credentialId,
      playlistId,
      { songId },
      "delete"
    );
    const response = h.response({
      status: "success",
      message: "Songs deleted from playlist successfuly",
    });
    response.code(200);
    return response;
  }

  async deletePlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId);
    await this._playlistsService.deletePlaylist(credentialId, playlistId);
    const response = h.response({
      status: "success",
      message: "Playlist deleted successfuly",
    });
    response.code(200);
    return response;
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistEditor(credentialId, playlistId);
    const playlistActivities =
      await this._playlistsService.getPlaylistActivities(playlistId);
    const response = h.response({
      status: "success",
      data: playlistActivities,
    });
    response.code(200);
    return response;
  }
}
