export default class ExportsHandler {
  constructor(service, validator) {
    this._producerService = service.producerService;
    this._playlistsService = service.playlistsService;
    this._postExportPlaylistPayload = validator.postExportPlaylistPayload;
  }

  async postExportPlaylistHandler(request, h) {
    this._postExportPlaylistPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    await this._playlistsService.verifyPlaylistEditor(userId, playlistId);
    const message = {
      userId,
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage(
      "export:playlists",
      JSON.stringify(message)
    );

    const response = h.response({
      status: "success",
      message: "Your request is on the queue",
    });
    response.code(201);
    return response;
  }
}
