import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/id-pictures";
fs.mkdirSync(uploadDir, { recursive: true });

//  allowed image types
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, "-"); // avoid spaces
    cb(null, `${timestamp}-${sanitizedOriginalName}`);
  },
});

// Only allow jpeg and png jpg files
// 5MB file size limit
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
});

export default upload;
