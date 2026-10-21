import multer, { type FileFilterCallback } from 'multer'; //middleware for handling multipart/form-data
import type { Request } from 'express';
import path from 'node:path';
import fs from 'fs';

// Make sure the upload directory exists or create one
const uploadDir = './public/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    // Generates a unique filename using timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    console.log('Image file name generated ' + uniqueSuffix);
    callback(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Filter files to allow only images (JPEG, JPG, PNG, GIF)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeType = allowedTypes.test(file.mimetype);
  console.log('Image file is extension is correct ' + mimeType);

  if (extName && mimeType) {
    return callback(null, true);
  } else {
    callback(null, false);
    throw new Error('Only image files are allowed!');
  }
};

// Initialize Multer middleware
export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit size to 2MB
  fileFilter: fileFilter,
});
