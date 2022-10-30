import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  app: {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 5000,
  },
  jwt: {
    keys: process.env.ACCESS_TOKEN_KEY,
    maxAge: process.env.ACCESS_TOKEN_AGE,
  },
  rabbitmq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};
