export default class SongsHandler {
  constructor(service, validator) {
    this._songsService = service.songsService;
    this._validateSongsPayload = validator.songsPayload;
  }

  //Post New songs
  async postSongHandler(request, h) {
    this._validateSongsPayload(request.payload);
    const { title, year, performer, genre, duration, albumId } =
      request.payload;
    const songId = await this._songsService.addSongs({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });
    const response = h.response({
      status: "success",
      message: "Song added successfully",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }
  //Get Songs
  async getSongsHandler(request, h) {
    const songs = await this._songsService.getSongs(request.query);
    const response = h.response({
      status: "success",
      message: "Songs Found",
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }
  //Get Song by ID
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._songsService.getSongById(id);
    const response = h.response({
      status: "success",
      message: "Song Found",
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }
  //Update Song by ID
  async putSongByIdHandler(request, h) {
    this._validateSongsPayload(request.payload);
    const { id } = request.params;
    const { title, year, performer, genre, duration, albumId } =
      request.payload;
    await this._songsService.updateSongById(id, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });
    const response = h.response({
      status: "success",
      message: "Song updated successfully",
    });
    response.code(200);
    return response;
  }
  //Delete Song
  async deleteSong(request, h) {
    const { id } = request.params;
    await this._songsService.deleteSong(id);
    const response = h.response({
      status: "success",
      message: "Song deleted successfully",
    });
    response.code(200);
    return response;
  }
}
