import redis from "redis";
import InvariantError from "../../exception/InvariantError.js";
import { config } from "../../utils/config/config.js";

export default class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });
    this._client.on("error", (error) => {
      console.error(error);
    });
    this._client.connect();
  }

  async setCache(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async getCache(key) {
    const result = await this._client.get(key);
    if (result === null) {
      throw new InvariantError("Cache not found");
    }
    return result;
  }

  deleteCache(key) {
    return this._client.del(key);
  }
}
