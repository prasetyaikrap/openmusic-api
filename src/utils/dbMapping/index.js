export const albumsResMap = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

export const songsResMap = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

export const songsDetailResMap = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

export const getPlaylistActivitesMap = ({
  playlist_id,
  username,
  title,
  action,
  time,
}) => ({
  playlistId: playlist_id,
  username,
  title,
  action,
  time,
});
