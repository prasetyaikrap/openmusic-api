export default class AlbumsHandler {
  constructor(service, validator) {
    this._albumsService = service.albumsService;
    this._usersService = service.usersService;
    this._cacheService = service.cacheService;
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
  //Add Like to album
  async postAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    //Verify user and album existence
    await this._usersService.verifyUserExistence(userId);
    await this._albumsService.verifyAlbum(albumId);
    //Update Album Like
    await this._albumsService.updateAlbumLikes(userId, albumId);
    //Delete existing cache
    await this._cacheService.deleteCache(`likes:${albumId}`);

    const response = h.response({
      status: "success",
      message: "Success to update album likes",
    });
    response.code(201);
    return response;
  }
  //Get Likes
  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    let likes;
    let dataSource;
    try {
      //Get data from cache
      likes = JSON.parse(await this._cacheService.getCache(`likes:${albumId}`));
      dataSource = "cache";
    } catch (err) {
      //Get data from database
      likes = await this._albumsService.getAlbumLikes(albumId);
      dataSource = "database";
      //Set cache, expiration in 1800 seconds - 30 minutes
      await this._cacheService.setCache(
        `likes:${albumId}`,
        JSON.stringify(likes),
        1800
      );
    }
    const response = h.response({
      status: "success",
      message: "Album likes found",
      data: {
        likes,
      },
    });
    response.code(200);
    response.header("X-Data-Source", dataSource);
    return response;
  }
}
