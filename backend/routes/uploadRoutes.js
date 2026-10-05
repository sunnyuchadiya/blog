import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('media'), uploadFile);

export default router;
