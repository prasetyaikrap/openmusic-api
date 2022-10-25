export default class ExportsHandler {
  constructor(service, validator) {
    this._producerService = service.producerService;
    this._postExportPlaylistPayload = validator.postExportPlaylistPayload;
  }
}
