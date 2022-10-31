import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exception/InvariantError.js";
import NotFoundError from "../../exception/NotFoundError.js";
import { albumSongList, albumsResMap } from "../../utils/dbMapping/albums.js";

export default class AlbumsService {
  constructor(service) {
    this._pool = new pkg.Pool();
    this._cacheService = service.cacheService;
  }

  //Post New Album
  async addAlbums({ name, year }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO albums(id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $4) RETURNING id",
      values: [id, name, year, insertedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add new album");
    }
    return result.rows[0].id;
  }

  //Get All Albums
  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");
    return result.rows.map(albumsResMap);
  }

  //Get Album by ID
  async getAlbumById(id) {
    const query = {
      text: `SELECT alb.id, alb.name, alb.year, alb.cover_url, alb.created_at, alb.updated_at, s.id AS song_id, s.title, s.performer 
      FROM albums alb
      LEFT JOIN songs s ON alb.id = s.album_id
      WHERE alb.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Record not found");
    }
    const resultMap = result.rows.map(albumsResMap);
    const songsList = resultMap.map(albumSongList);
    const albumDetails = {
      id: resultMap[0].id,
      name: resultMap[0].name,
      year: resultMap[0].year,
      coverUrl: resultMap[0].coverUrl,
      created_at: resultMap[0].createdAt,
      updated_at: resultMap[0].updatedAt,
      songs: songsList[0] != null ? songsList : [],
    };
    return albumDetails;
  }

  //Update Album by ID
  async updateAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Updating Failed. Albums ID not found");
    }
  }

  //Delete Album by ID
  async deleteAlbum(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Deleting Failed. Albums ID not found");
    }
  }

  async verifyAlbum(albumId) {
    const query = {
      text: `SELECT id FROM albums WHERE id = $1`,
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Album not found");
    }
  }

  //Upload album cover
  async uploadAlbumCover(albumId, coverUrl) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3`,
      values: [coverUrl, updatedAt, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Failed to update row");
    }
  }

  async updateAlbumLikes(userId, albumId) {
    const rowCount = await this.verifyUserAlbumLike(userId, albumId);
    if (!rowCount) {
      const query = {
        text: `INSERT INTO user_album_likes(user_id, album_id) VALUES($1, $2) RETURNING id`,
        values: [userId, albumId],
      };

      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new InvariantError("Failed to add like");
      }
      await this.incrementAlbumLike(albumId);
    }

    if (rowCount) {
      const query = {
        text: `DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2`,
        values: [userId, albumId],
      };
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new InvariantError("Failed to remove like");
      }
      await this.decrementAlbumLike(albumId);
    }
    await this._cacheService.deleteCache(`likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const data = {
        likes: JSON.parse(
          await this._cacheService.getCache(`likes:${albumId}`)
        ),
        source: "cache",
      };
      return data;
    } catch (err) {
      const query = {
        text: `SELECT likes FROM albums WHERE id = $1`,
        values: [albumId],
      };
      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError("Album not found");
      }
      const data = {
        likes: result.rows[0].likes,
        source: "database",
      };
      await this._cacheService.setCache(`likes:${albumId}`, data.likes);
      return data;
    }
  }

  async verifyUserAlbumLike(userId, albumId) {
    const query = {
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async incrementAlbumLike(albumId) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET likes = likes + 1, updated_at = $2 WHERE id = $1",
      values: [albumId, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Album Not Found");
    }
  }

  async decrementAlbumLike(albumId) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET likes = likes - 1, updated_at = $2 WHERE id = $1",
      values: [albumId, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Album Not Found");
    }
  }
}
