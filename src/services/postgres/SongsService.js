import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exception/InvariantError.js";
import NotFoundError from "../../exception/NotFoundError.js";
import { songsDetailResMap, songsResMap } from "../../utils/dbMapping/songs.js";

export default class SongsService {
  constructor() {
    this._pool = new pkg.Pool();
  }

  //Post New Songs
  async addSongs({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add new songs");
    }
    return result.rows[0].id;
  }

  //Get All Songs
  async getSongs(query) {
    let dbQuery = "SELECT id, title, performer FROM songs";
    for (const key in query) {
      if (query[key] != undefined) {
        if (!dbQuery.includes("WHERE")) {
          dbQuery += ` WHERE`;
        } else {
          dbQuery += ` AND`;
        }
        dbQuery += ` LOWER(${key}) LIKE '%${query[key]}%'`;
      }
    }
    const result = await this._pool.query(dbQuery);
    return result.rows.map(songsResMap);
  }

  //Get Song by ID
  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Record not found");
    }
    return result.rows.map(songsDetailResMap)[0];
  }
  //Get Songs by ID
  async getSongsByAlbumId(albumid) {
    const query = {
      text: `SELECT * FROM songs WHERE album_id = $1`,
      values: [albumid],
    };
    const result = await this._pool.query(query);
    return result.rows.map(songsResMap);
  }

  //Update Song by ID
  async updateSongById(
    id,
    { title, year, performer, genre, duration, albumId }
  ) {
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Updated Failed. Songs ID not found");
    }
  }

  //Delete Songs
  async deleteSong(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Deleting Failed. Songs ID not found");
    }
  }

  async verifySong(id) {
    const query = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Songs ID not found");
    }
  }
}
