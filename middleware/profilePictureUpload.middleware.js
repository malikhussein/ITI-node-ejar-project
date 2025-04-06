// middleware/profilePictureUpload.middleware.js
import multer from "multer";
import fs from "fs";

const uploadDir = "uploads/profile-pictures";
fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timestamp}-${sanitizedOriginalName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"), false);
  }
};

const uploadProfilePicture = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default uploadProfilePicture;
