import fs from "fs";
import path from "path";

export default class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._imagesFolder = path.resolve(this._folder, "images");

    const folders = [folder, this._imagesFolder];
    for (const f of folders) {
      if (!fs.existsSync(f)) {
        fs.mkdirSync(f, { recursive: true });
      }
    }
  }
  writeImageFile(albumId, file, meta) {
    const filename = `albumCover-${albumId}.${
      meta.headers["content-type"].split("/")[1]
    }`;
    const filePath = `${this._imagesFolder}/${filename}`;
    const fileStream = fs.createWriteStream(filePath);
    const result = {
      filename,
      fileUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
    };
    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      file.pipe(fileStream);
      file.on("end", () => resolve(result));
    });
  }
}
