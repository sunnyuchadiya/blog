import multer from 'multer';

// Memory storage for streaming direct uploads to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for images, gifs, videos
});
