import pkg from "pg";
import InvariantError from "../../exception/InvariantError.js";

export default class AuthenticationsService {
  constructor() {
    this._pool = new pkg.Pool();
  }

  //Add Refresh Token
  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO auth_tokens VALUES($1)",
      values: [token],
    };
    await this._pool.query(query);
  }
  //Verify Refresh Token
  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM auth_tokens WHERE token = $1",
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Invalid refresh token");
    }
  }

  //Delete Refresh Token
  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM auth_tokens WHERE token = $1",
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Delete Failed. Token does not exist");
    }
  }
}
