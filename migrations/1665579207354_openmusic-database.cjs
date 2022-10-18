/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(16)",
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(16)",
      primaryKey: true,
      notNull: true,
    },
    title: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(30)",
      notNull: true,
    },
    duration: {
      type: "INT",
      notNull: false,
    },
    albumId: {
      type: "VARCHAR(16)",
      notNull: false,
      references: "albums",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(21)",
      primaryKey: true,
      notNull: true,
    },
    username: {
      type: "VARCHAR(20)",
      unique: true,
      notNull: true,
    },
    password: {
      type: "TEXT",
      notNull: true,
    },
    fullname: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });
  pgm.createTable("auth_tokens", {
    token: {
      type: "TEXT",
      unique: true,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("songs", {
    cascade: true,
  });
  pgm.dropTable("albums", {
    cascade: true,
  });
  pgm.dropTable("users", {
    cascade: true,
  });
  pgm.dropTable("auth_tokens", {
    cascade: true,
  });
};
