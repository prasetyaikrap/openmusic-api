const albumsRoutes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: (request, h) => handler.postAlbumsHandler(request, h),
  },
  {
    method: "GET",
    path: "/albums",
    handler: (request, h) => handler.getAlbumsHandler(request, h),
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: (request, h) => handler.getAlbumByIdHandler(request, h),
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: (request, h) => handler.putAlbumByIdHandler(request, h),
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: (request, h) => handler.deleteAlbum(request, h),
  },
];

const songsRoutes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: (request, h) => handler.postSongsHandler(request, h),
  },
  {
    method: "GET",
    path: "/songs",
    handler: (request, h) => handler.getSongsHandler(request, h),
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: (request, h) => handler.getSongByIdHandler(request, h),
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: (request, h) => handler.putSongByIdHandler(request, h),
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: (request, h) => handler.deleteSong(request, h),
  },
];

export { albumsRoutes, songsRoutes };
