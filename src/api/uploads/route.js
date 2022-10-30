import path from "path";

const Routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: (request, h) => handler.postAlbumCoverHandler(request, h),
    options: {
      payload: {
        maxBytes: 512000,
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
    },
  },
  {
    method: "GET",
    path: "/upload/{params*}",
    handler: {
      directory: {
        path: path.resolve(process.cwd(), "src/uploads"),
      },
    },
  },
];

export default Routes;
