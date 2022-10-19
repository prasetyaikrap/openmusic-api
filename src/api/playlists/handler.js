export default class PlaylistsHandler {
  constructor(service, validator) {
    this._playlistsService = service.playlistsService;
    this._postPlaylistPayload = validator.postPlaylistPayload;
    this._putPlaylistPayload = validator.putPlaylistPayload;
    this._postPlaylistSongPayload = validator.postPlaylistSongPayload;
    this._deletePlaylistSongPayload = validator._deletePlaylistSongPayload;
  }

  async postPlaylistHandler(request, h) {
    this._postPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;
    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId,
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
}
