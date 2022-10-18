import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exception/InvariantError.js";
import NotFoundError from "../../exception/NotFoundError.js";
import SongsService from "./SongsService.js";
import { albumsResMap, songsResMap } from "../../utils/dbMapping/index.js";

export default class AlbumsService {
  constructor() {
    this._pool = new pkg.Pool();
    this._songsService = new SongsService();
  }

  //Post New Album
  async addAlbums({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES ($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
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
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Record not found");
    }
    const songsList = await this._songsService.getSongsByAlbumId(id);
    const albumDetails = result.rows.map(albumsResMap)[0];
    albumDetails.songs = songsList;
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
    if (!result.rows.length) {
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
    if (!result.rows.length) {
      throw new NotFoundError("Deleting Failed. Albums ID not found");
    }
  }
}
