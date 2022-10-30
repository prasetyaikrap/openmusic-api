export default class AlbumsHandler {
  constructor(service, validator) {
    this._albumsService = service.albumsService;
    this._validateAlbumsPayload = validator.albumsPayload;
  }
  // Post New Album
  async postAlbumHandler(request, h) {
    this._validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._albumsService.addAlbums({ name, year });
    const response = h.response({
      status: "success",
      message: "Album added successfully",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }
  // Get All Album
  async getAlbumsHandler(request, h) {
    const albums = await this._albumsService.getAlbums();
    const response = h.response({
      status: "success",
      message: "Albums Found",
      data: {
        albums,
      },
    });
    response.code(200);
    return response;
  }
  // Get Album by ID
  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    const response = h.response({
      status: "success",
      message: "Album Found",
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }
  // Put Album by ID
  async putAlbumByIdHandler(request, h) {
    this._validateAlbumsPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;
    await this._albumsService.updateAlbumById(id, { name, year });
    const response = h.response({
      status: "success",
      message: "Album updated successfully",
    });
    response.code(200);
    return response;
  }
  // Delete Album
  async deleteAlbumHandler(request, h) {
    const { id } = request.params;
    await this._albumsService.deleteAlbum(id);
    const response = h.response({
      status: "success",
      message: "Album deleted successfully",
    });
    response.code(200);
    return response;
  }
}
