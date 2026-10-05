import cloudinary from '../config/cloudinary.js';

// @desc    Upload file (Image, GIF, Video) to Cloudinary
// @route   POST /api/upload
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const isVideo = req.file.mimetype.startsWith('video');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'wacaiki_blogs',
        resource_type: isVideo ? 'video' : 'image',
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
        }
        return res.json({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
