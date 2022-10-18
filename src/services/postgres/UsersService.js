import pkg from "pg";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import InvariantError from "../../exception/InvariantError.js";
import AuthenticationError from "../../exception/AuthenticationError.js";

export default class UserService {
  constructor() {
    this._pool = new pkg.Pool();
  }

  //Post New User
  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashPassword = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, username, hashPassword, fullname, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add new user");
    }
    return result.rows[0].id;
  }
  //Verify Username
  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError(
        "Failed to add new user. Username is already exist"
      );
    }
  }
  //Get User
  async getUserById(userid) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userid],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("User Not Found");
    }
    return result.rows[0];
  }

  //Verify user credential
  async verifyUserCredential({ username, password }) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError("Invalid Credential");
    }
    const { id, password: hashedPassword } = result.rows[0];
    const matched = await bcrypt.compare(password, hashedPassword);
    if (!matched) {
      throw new AuthenticationError("Invalid Credential");
    }
    return id;
  }
}
