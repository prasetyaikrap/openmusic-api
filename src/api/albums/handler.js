export default class AlbumsHandler {
  constructor(service, validator) {
    this._service = service.albumsService;
    this._validator = validator;
  }
  // Post New Album
  async postAlbumHandler(request, h) {
    this._validator.albumsPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbums({ name, year });
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
    const albums = await this._service.getAlbums();
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
    const album = await this._service.getAlbumById(id);
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
    this._validator.albumsPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;
    await this._service.updateAlbumById(id, { name, year });
    const response = h.response({
      status: "success",
      message: "Album updated successfully",
    });
    response.code(200);
    return response;
  }
  // Delete Album
  async deleteAlbum(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbum(id);
    const response = h.response({
      status: "success",
      message: "Album deleted successfully",
    });
    response.code(200);
    return response;
  }
}
