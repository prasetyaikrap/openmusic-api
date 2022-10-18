export default class AuthenticationsHandler {
  constructor(service, validator, tokenManager) {
    this._authenticationsService = service.authenticationsService;
    this._usersService = service.usersService;
    this._postAuthenticationPayload = validator.postAuthenticationPayload;
    this._putAuthenticationPayload = validator.putAuthenticationPayload;
    this._deleteAuthenticationPayload = validator.deleteAuthenticationPayload;
    this._tokenManager = tokenManager;
  }

  async postAuthenticationHandler(request, h) {
    //Verify Payload
    this._postAuthenticationPayload(request.payload);
    //Verify User Credential
    const { username, password } = request.payload;
    const id = await this._usersService.verifyUserCredential({
      username,
      password,
    });

    //Generate Token
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    //Store Refresh Token
    await this._authenticationsService.addRefreshToken(refreshToken);

    //Response
    const response = h.response({
      status: "success",
      message: "Authentication success",
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    //Verify Payload
    this._putAuthenticationPayload(request.payload);

    //Verify refresh token
    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    //Generate new accessToken token
    const accessToken = this._tokenManager.generateAccessToken({ id });

    //Response
    const response = h.response({
      status: "success",
      message: "Access token updated successfully",
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    //Verify payload
    this._deleteAuthenticationPayload(request.payload);

    //Delete Refresh Token
    const { refreshToken } = request.payload;
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    //Response
    const response = h.response({
      status: "success",
      message: "Refresh token deleted",
    });
    response.code(200);
    return response;
  }
}
