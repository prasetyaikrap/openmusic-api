import ClientError from "../../exception/ClientError.js";

export class AlbumsHandler {
  constructor(service, validator) {
    this._service = service.albumsService;
    this._validator = validator;
  }
  // Post New Album
  async postAlbumsHandler(request, h) {
    try {
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
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Internal Server Error. Please try again later",
      });
      response.code(500);
      return response;
    }
  }
  // Get All Album
  async getAlbumsHandler(request, h) {
    try {
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
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Internal Server Error. Please try again later",
      });
      response.code(500);
      return response;
    }
  }
  // Get Album by ID
  async getAlbumByIdHandler(request, h) {
    try {
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
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Internal Server Error. Please try again later",
      });
      response.code(500);
      return response;
    }
  }
  // Put Album by ID
  async putAlbumByIdHandler(request, h) {
    try {
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
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Internal Server Error. Please try again later",
      });
      response.code(500);
      return response;
    }
  }
  // Delete Album
  async deleteAlbum(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbum(id);
      const response = h.response({
        status: "success",
        message: "Album deleted successfully",
      });
      response.code(200);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Internal Server Error. Please try again later",
      });
      response.code(500);
      return response;
    }
  }
}

export class SongsHandler {
  constructor(service, validator) {
    this._service = service.songsService;
    this._validator = validator;
  }

  //Post New songs
  async postSongsHandler(request, h) {
    try {
      this._validator.songsPayload(request.payload);
      const { title, year, performer, genre, duration, albumId } =
        request.payload;
      const songId = await this._service.addSongs({
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
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: `Internal Server Error. ${err.message}`,
      });
      response.code(500);
      return response;
    }
  }
  //Get Songs
  async getSongsHandler(request, h) {
    try {
      const songs = await this._service.getSongs(request.query);
      const response = h.response({
        status: "success",
        message: "Songs Found",
        data: {
          songs,
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: `Internal Server Error. ${err.message}`,
      });
      response.code(500);
      return response;
    }
  }
  //Get Song by ID
  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      const response = h.response({
        status: "success",
        message: "Song Found",
        data: {
          song,
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: `Internal Server Error. ${err.message}`,
      });
      response.code(500);
      return response;
    }
  }
  //Update Song by ID
  async putSongByIdHandler(request, h) {
    try {
      this._validator.songsPayload(request.payload);
      const { id } = request.params;
      const { title, year, performer, genre, duration, albumId } =
        request.payload;
      await this._service.updateSongById(id, {
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
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: `Internal Server Error. ${err.message}`,
      });
      response.code(500);
      return response;
    }
  }
  //Delete Song
  async deleteSong(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSong(id);
      const response = h.response({
        status: "success",
        message: "Song deleted successfully",
      });
      response.code(200);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: `Internal Server Error. ${err.message}`,
      });
      response.code(500);
      return response;
    }
  }
}
