import { Blog } from '../models/Blog.js';

// Helper to find blog by MongoDB ObjectId OR Slug safely
const findBlogByIdOrSlug = async (idOrSlug) => {
  if (!idOrSlug) return null;
  return (await Blog.findById(idOrSlug).catch(() => null)) || (await Blog.findOne({ slug: String(idOrSlug).toLowerCase() }));
};

// GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status) filter.status = status;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, mediaType, coverImage, status, isFeatured } = req.body;
    if (!title || !excerpt || !content || !coverImage) {
      return res.status(400).json({ message: 'Title, excerpt, content, and cover URL are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      category: category || 'Fall Collection',
      tags: tags || [category ? category.toUpperCase() : 'FALL COLLECTION'],
      mediaType: mediaType || 'Image',
      coverImage,
      status: status || 'Published',
      isFeatured: Boolean(isFeatured),
      author: {
        name: req.user.name,
        role: req.user.role,
        avatar: req.user.avatar,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    Object.assign(blog, req.body);
    const updated = await blog.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    await Blog.findByIdAndDelete(blog._id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/blogs/:id/like
export const toggleLikeBlog = async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const hasLiked = blog.likedUserIps.includes(clientIp);

    if (hasLiked) {
      blog.likes = Math.max(0, blog.likes - 1);
      blog.likedUserIps = blog.likedUserIps.filter(ip => ip !== clientIp);
    } else {
      blog.likes += 1;
      blog.likedUserIps.push(clientIp);
    }

    await blog.save();
    res.json({ likes: blog.likes, isLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/blogs/:id/comment
export const addCommentBlog = async (req, res) => {
  try {
    const { author, text, avatar } = req.body;
    if (!author || !text) return res.status(400).json({ message: 'Author and text are required' });

    const blog = await findBlogByIdOrSlug(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.unshift({
      author: author.trim(),
      text: text.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    await blog.save();
    res.status(201).json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
