import { nanoid } from "nanoid";
import pkg from "pg";
import AuthorizationError from "../../exception/AuthorizationError.js";
import InvariantError from "../../exception/InvariantError.js";
import NotFoundError from "../../exception/NotFoundError.js";
import SongsService from "./SongsService.js";

export default class PlaylistsService {
  constructor() {
    this._pool = new pkg.Pool();
    this._songsService = new SongsService();
  }

  async addPlaylist({ name, owner }) {
    const id = `pl-${nanoid(13)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, owner, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add new playlist");
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
      FROM playlists p
      JOIN users u ON p.owner = u.id 
      WHERE p.owner = $1
      ORDER BY p.updated_at DESC`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(owner, playlistId) {
    const query = {
      text: "DELETE FROM playlists WHERE owner = $1 AND id = $2",
      values: [owner, playlistId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount == 0) {
      throw new NotFoundError("Delete Failed. Playlist does not exist");
    }
  }

  async addSongToPlaylist(playlistId, { songId }) {
    await this._songsService.verifySong(songId);
    const id = `ps-${nanoid(9)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add song to playlist");
    }
  }

  async getPlaylistById(owner, playlistId) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
      FROM playlists p 
      JOIN users u ON p.owner = u.id 
      WHERE p.owner = $1 AND p.id = $2`,
      values: [owner, playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Record not found");
    }
    const songs = await this.getSongsFromPlaylist(playlistId);
    result.rows[0].songs = songs;
    return result.rows[0];
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer
      FROM playlists p
      JOIN playlist_songs ps ON p.id = ps.playlist_id
      JOIN songs s ON ps.song_id = s.id
      WHERE p.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, { songId }) {
    const query = {
      text: `DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2`,
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount == 0) {
      throw new NotFoundError("Delete Failed. Song on playlist not found");
    }
  }

  async verifyPlaylistOwner(owner, playlistId) {
    const query = {
      text: `SELECT id, owner FROM playlists WHERE id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist Not Found");
    }
    if (result.rows[0].owner != owner) {
      throw new AuthorizationError("Unauthorized Access");
    }
  }
}
