import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, default: 'Fall Collection' },
    tags: [{ type: String, uppercase: true }],
    mediaType: { type: String, enum: ['Image', 'GIF', 'Video', 'URL'], default: 'Image' },
    coverImage: { type: String, required: true },
    status: { type: String, enum: ['Published', 'Draft', 'Scheduled'], default: 'Published' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedUserIps: [{ type: String }],
    comments: [commentSchema],
    author: {
      name: { type: String, default: 'PARIS EDITORIAL DESK' },
      role: { type: String, default: 'Editorial Director' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
    },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Blog = mongoose.model('Blog', blogSchema);
