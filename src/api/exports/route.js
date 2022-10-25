const Routes = (handler) => [
  {
    method: "POST",
    path: "export/playlists/{playlistId}",
    handler: (request, h) => handler.postExportPlaylistHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
];

export default Routes;
