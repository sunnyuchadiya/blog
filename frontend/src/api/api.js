const API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173')
  ? 'http://localhost:5000/api'
  : '/api';

const getAuthHeader = () => {
  const savedUser = localStorage.getItem('wacaiki_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user.token) {
        return { Authorization: `Bearer ${user.token}` };
      }
    } catch (e) {}
  }
  return {};
};

export const api = {
  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        // Fallback for static admin if backend is restarting
        if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin123') {
          return {
            _id: 'static_admin_id',
            name: 'EDITORIAL DIRECTOR (ADMIN)',
            email: 'admin@gmail.com',
            role: 'Editorial Director',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            token: 'static_admin_jwt_token_wacaiki_2025'
          };
        }
        throw new Error('Unable to connect to backend server at http://localhost:5000. Please start node server.js');
      }
      throw err;
    }
  },

  async register(name, email, password, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        throw new Error('Unable to connect to backend server at http://localhost:5000. Please start node server.js');
      }
      throw err;
    }
  },

  // Blogs
  async getBlogs(category, status) {
    let url = `${API_BASE_URL}/blogs?`;
    if (category && category !== 'All') url += `category=${encodeURIComponent(category)}&`;
    if (status) url += `status=${encodeURIComponent(status)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch blogs');
    return data;
  },

  async getBlogById(id) {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch blog');
    return data;
  },

  async createBlog(blogData) {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(blogData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create blog');
    return data;
  },

  async updateBlog(id, blogData) {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(blogData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update blog');
    return data;
  },

  async deleteBlog(id) {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete blog');
    return data;
  },

  async toggleLike(id) {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}/like`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle like');
    return data;
  },

  async addComment(id, author, text) {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to post comment');
    return data;
  },

  // Cloudinary Upload
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('media', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Media upload failed');
    return data;
  },
};
