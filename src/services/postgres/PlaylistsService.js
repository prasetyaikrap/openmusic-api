import { nanoid } from "nanoid";
import pkg from "pg";
import AuthorizationError from "../../exception/AuthorizationError.js";
import InvariantError from "../../exception/InvariantError.js";
import NotFoundError from "../../exception/NotFoundError.js";
import { getPlaylistActivitiesMap } from "../../utils/dbMapping/playlists.js";

export default class PlaylistsService {
  constructor() {
    this._pool = new pkg.Pool();
  }

  async addPlaylist(owner, { name }) {
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

  async getPlaylists(userId) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
      FROM playlists p
      JOIN users u ON p.owner = u.id 
      LEFT JOIN collaborations cb ON p.id = cb.playlist_id
      WHERE p.owner = $1 OR cb.user_id = $1
      ORDER BY p.updated_at DESC`,
      values: [userId],
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
    await this.verifyNewSongToPlaylist(playlistId, songId);
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

  async verifyNewSongToPlaylist(playlistId, songId) {
    const query = {
      text: `SELECT id FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2`,
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      throw new InvariantError("Song already exist in playlists");
    }
  }

  async getPlaylistById(userId, playlistId) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
      FROM playlists p 
      JOIN users u ON p.owner = u.id
      LEFT JOIN collaborations cb ON p.id = cb.playlist_id 
      WHERE p.id = $1 AND (p.owner = $2 OR cb.user_id = $2) `,
      values: [playlistId, userId],
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

  async verifyPlaylistExistence(playlistId) {
    const query = {
      text: `SELECT id, owner FROM playlists WHERE id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist Not Found");
    }
    return result.rows[0];
  }

  async verifyPlaylistOwner(owner, playlistId) {
    const playlist = await this.verifyPlaylistExistence(playlistId);
    if (playlist.owner != owner) {
      throw new AuthorizationError("Unauthorized Access");
    }
  }

  async verifyPlaylistEditor(userId, playlistId) {
    await this.verifyPlaylistExistence(playlistId);
    const query = {
      text: `SELECT p.id, p.owner, cb.user_id AS collaborator
      FROM playlists p
      LEFT JOIN collaborations cb ON p.id = cb.playlist_id
      WHERE p.id = $1 AND (p.owner = $2 OR cb.user_id = $2)`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError("Unauthorized access");
    }
  }

  async addPlaylistActivites(userId, playlistId, { songId }, action) {
    const time = new Date().toISOString();
    const query = {
      text: `INSERT INTO playlist_activites(playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add activites");
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT pa.playlist_id, u.username, s.title, pa.action, pa.time 
      FROM playlist_activites pa
      JOIN users u ON pa.user_id = u.id
      JOIN songs s ON pa.song_id = s.id
      WHERE pa.playlist_id = $1
      ORDER BY pa.time ASC`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Activities record not found");
    }
    const resultMap = result.rows.map(getPlaylistActivitiesMap);
    const activites = {
      playlistId: resultMap[0].playlistId,
      activities: resultMap.map(({ username, title, action, time }) => ({
        username,
        title,
        action,
        time,
      })),
    };
    return activites;
  }
}
