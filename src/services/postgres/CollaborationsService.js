import { nanoid } from "nanoid";
import pkg from "pg";
import InvariantError from "../../exception/InvariantError.js";
import NotFoundError from "../../exception/NotFoundError.js";

export default class CollaborationsService {
  constructor() {
    this._pool = new pkg.Pool();
  }

  async addCollaborator({ playlistId, userId }) {
    await this.verifyNewCollaborator(playlistId, userId);
    const id = `collab-${nanoid(9)}`;
    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add collaborator");
    }
    return result.rows[0].id;
  }

  async deleteCollaborator({ playlistId, userId }) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount == 0) {
      throw new NotFoundError(
        "Delete failed. Collaborator record does not exist"
      );
    }
  }

  async verifyNewCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      throw new InvariantError("Collaborator already exists");
    }
  }
}
