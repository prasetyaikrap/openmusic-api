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
    cover_url: {
      type: "TEXT",
    },
    likes: {
      type: "INT",
      default: 0,
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
    album_id: {
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
  pgm.createTable("user_album_likes", {
    id: {
      type: "SERIAL",
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(21)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    album_id: {
      type: "VARCHAR(16)",
      notNull: true,
      references: "albums",
      onDelete: "CASCADE",
    },
  });
  pgm.createTable("auth_tokens", {
    token: {
      type: "TEXT",
      unique: true,
      notNull: true,
    },
  });
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(16)",
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(21)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
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
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(12)",
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(16)",
      notNull: true,
      references: "playlists",
      onDelete: "CASCADE",
    },
    song_id: {
      type: "VARCHAR(16)",
      notNull: true,
      references: "songs",
      onDelete: "CASCADE",
    },
  });
  pgm.createTable("playlist_activites", {
    id: {
      type: "SERIAL",
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(16)",
      notNull: true,
      references: "playlists",
      onDelete: "CASCADE",
    },
    song_id: {
      type: "VARCHAR(16)",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(21)",
      notNull: true,
    },
    action: {
      type: "VARCHAR(20)",
      notNull: true,
    },
    time: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });
  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(16)",
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(16)",
      notNull: true,
      references: "playlists",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "VARCHAR(21)",
      notNull: true,
      references: "users",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("songs", {
    cascade: true,
  });
  pgm.dropTable("user_album_likes", {
    cascade: true,
  });
  pgm.dropTable("albums", {
    cascade: true,
  });
  pgm.dropTable("collaborations", {
    cascade: true,
  });
  pgm.dropTable("playlist_activites", {
    cascade: true,
  });
  pgm.dropTable("playlist_songs", {
    cascade: true,
  });
  pgm.dropTable("playlists", {
    cascade: true,
  });
  pgm.dropTable("users", {
    cascade: true,
  });
  pgm.dropTable("auth_tokens", {
    cascade: true,
  });
};
