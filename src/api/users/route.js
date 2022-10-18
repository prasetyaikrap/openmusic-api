const Routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: (request, h) => handler.getUserByIdHandler(request, h),
  },
];

export default Routes;
