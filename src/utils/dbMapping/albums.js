export const albumsResMap = ({
  id,
  name,
  year,
  cover_url,
  created_at,
  updated_at,
  song_id,
  title,
  performer,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
  createdAt: created_at,
  updatedAt: updated_at,
  songId: song_id,
  title,
  performer,
});

export const albumSongList = ({ songId, title, performer }) => {
  if (songId != null) {
    return {
      id: songId,
      title,
      performer,
    };
  }
};
