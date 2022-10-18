export default class UsersHandler {
  constructor(service, validator) {
    this._usersService = service.usersService;
    this._validateUsersPayload = validator.usersPayload;
  }

  //Post new user
  async postUserHandler(request, h) {
    await this._validateUsersPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._usersService.addUser({
      username,
      password,
      fullname,
    });
    const response = h.response({
      status: "success",
      message: "User added successfully",
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}
