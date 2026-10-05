import express from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
  addCommentBlog,
} from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

router.post('/:id/like', toggleLikeBlog);
router.post('/:id/comment', addCommentBlog);

export default router;
