export default class UploadsHandler {
  constructor(service, validator) {
    this._storageService = service.storageService;
    this._albumsService = service.albumsService;
    this._validateImageHeaderPayload = validator.imageHeaderPayload;
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    //Validate request header
    this._validateImageHeaderPayload(cover.hapi.headers);
    const { filename, fileUrl } = await this._storageService.writeImageFile(
      albumId,
      cover,
      cover.hapi
    );
    await this._albumsService.uploadAlbumCover(albumId, fileUrl);

    const response = h.response({
      status: "success",
      message: `File ${filename} uploaded successfully`,
    });
    response.code(201);
    return response;
  }
}
