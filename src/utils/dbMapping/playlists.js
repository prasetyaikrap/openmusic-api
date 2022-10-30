export const getPlaylistActivitiesMap = ({
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

export const playlistActivitiesMap = ({ username, title, action, time }) => ({
  username,
  title,
  action,
  time,
});
