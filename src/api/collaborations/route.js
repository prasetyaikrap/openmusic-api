const Routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: (request, h) => handler.postCollaboratorHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/collaborations",
    handler: (request, h) => handler.deleteCollaboratorHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
];

export default Routes;
