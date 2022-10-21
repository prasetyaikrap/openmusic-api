export default class CollaborationsHandler {
  constructor(service, validator) {
    this._collaborationsService = service.collaborationsService;
    this._playlistsService = service.playlistsService;
    this._usersService = service.usersService;
    this._postCollaboratorPayload = validator.postCollaboratorPayload;
    this._deleteCollaboratorPayload = validator.deleteCollaboratorPayload;
  }

  async postCollaboratorHandler(request, h) {
    //Validate Payload
    await this._postCollaboratorPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    //Validate Playlist Owner
    await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId);
    //Validate collaborator is exist
    await this._usersService.verifyUserExistence(userId);
    const collaborationId = await this._collaborationsService.addCollaborator({
      playlistId,
      userId,
    });
    const response = h.response({
      status: "success",
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaboratorHandler(request, h) {
    //Validate Payload
    await this._deleteCollaboratorPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    //Validate Owner
    await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId);
    //Delete Collaboration Row
    await this._collaborationsService.deleteCollaborator({
      playlistId,
      userId,
    });
    const response = h.response({
      status: "success",
      message: "Collaborator deleted successfully",
    });
    response.code(200);
    return response;
  }
}
