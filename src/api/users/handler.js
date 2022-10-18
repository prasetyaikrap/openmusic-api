export default class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  //Post new user
  async postUserHandler(request, h) {
    await this._validator(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({
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
