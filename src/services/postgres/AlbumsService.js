import pkg from "pg";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import InvariantError from "../../exception/InvariantError.js";
import NotFoundError from "../../exception/NotFoundError.js";
import { albumsResMap } from "../../utils/dbMapping/albums.js";

export default class AlbumsService {
  constructor() {
    this._pool = new pkg.Pool();
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
    const songsList = resultMap.map(({ songId, title, performer }) => {
      if (songId != null) {
        return {
          id: songId,
          title,
          performer,
        };
      }
    });
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
}
