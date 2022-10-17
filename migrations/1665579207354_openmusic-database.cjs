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
  pgm.createTable("users", {});
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
  pgm.dropTable("albums");
};
