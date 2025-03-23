import fs from "fs";

export const cleanupUploadedFiles = (req, res, next) => {
  // Run after route fails (used before validation middleware)
  // so that we can delete any uploaded files
  // if the request fails
  res.on("finish", () => {
    if (res.statusCode >= 400 && req.files) {
      Object.values(req.files).flat().forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("❌ Failed to delete file:", file.path);
          }
        });
      });
    }
  });

  next();
};
