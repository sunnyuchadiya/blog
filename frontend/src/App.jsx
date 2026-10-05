import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import BlogHome from './pages/BlogHome';
import ArticleDetail from './pages/ArticleDetail';
import CmsDashboard from './pages/CmsDashboard';
import StoryStudio from './pages/StoryStudio';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import { api } from './api/api';
import { Search, X, ArrowUpRight } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ currentUser, children, showToast }) {
  const location = useLocation();

  if (!currentUser || currentUser.role !== 'Editorial Director') {
    showToast('Admin authorization required to access the Editorial CMS Studio.', 'error');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

import { INITIAL_BLOGS } from './data/initialBlogs';

export default function App() {
  const [articles, setArticles] = useState(INITIAL_BLOGS);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('wacaiki_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [likedArticleIds, setLikedArticleIds] = useState(() => {
    const savedLikes = localStorage.getItem('wacaiki_liked_ids');
    return savedLikes ? JSON.parse(savedLikes) : [];
  });

  const [toast, setToast] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch blogs from MongoDB Atlas Backend
  const fetchBlogs = async () => {
    try {
      const data = await api.getBlogs();
      if (data && data.length > 0) {
        const mapped = data.map(item => ({
          ...item,
          id: item._id || item.id,
        }));
        setArticles(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch blogs from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Sync User & Likes local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wacaiki_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wacaiki_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wacaiki_liked_ids', JSON.stringify(likedArticleIds));
  }, [likedArticleIds]);

  // Dynamic Document Title & Meta Description Manager
  useEffect(() => {
    const path = location.pathname;
    let title = "Wacaiki — Artificial Intelligence & Tech Monograph";
    let desc = "Discover the latest breakthroughs in Artificial Intelligence, Quantum Computing, Cybersecurity, and Future Tech at Wacaiki.";

    if (path === '/') {
      title = "Wacaiki — Discover Artificial Intelligence & Tech Innovations";
      desc = "Explore high-impact technical monographs, AI agentic workflows, and quantum computing insights.";
    } else if (path.startsWith('/article/')) {
      const artId = path.split('/article/')[1];
      const found = articles.find(a => a.id === artId || a.slug === artId);
      if (found) {
        title = `${found.title} — Wacaiki Monograph`;
        desc = found.excerpt;
      }
    } else if (path === '/login') {
      title = "Sign In — Editorial Studio Access — Wacaiki";
      desc = "Sign in as Editorial Director or Admin to manage published stories and drafts.";
    } else if (path === '/register') {
      title = "Register Account — Wacaiki Publishing";
      desc = "Join the Wacaiki publishing platform and contributor network.";
    } else if (path === '/cms') {
      title = "Editorial Suite & CMS Overview — Wacaiki Studio";
      desc = "Manage published stories, draft new dispatches, and review reader analytics.";
    } else if (path.startsWith('/cms/new') || path.startsWith('/cms/edit/')) {
      title = "Story Studio — Create & Edit Dispatches — Wacaiki";
      desc = "Compose new editorial stories with rich text editing and cover art curation.";
    } else {
      title = "404 Page Not Found — Wacaiki";
    }

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [location.pathname, articles]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleLogin = async (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('You have been signed out.', 'info');
  };

  const handleLikeArticle = async (id) => {
    try {
      const res = await api.toggleLike(id);
      if (res.isLiked) {
        setLikedArticleIds(prev => [...prev, id]);
        showToast(`Liked story! Total likes: ${res.likes}`, 'success');
      } else {
        setLikedArticleIds(prev => prev.filter(lId => lId !== id));
        showToast(`Removed your like.`, 'info');
      }
      setArticles(prev => prev.map(art => art.id === id ? { ...art, likes: res.likes } : art));
    } catch (err) {
      showToast(err.message || 'Failed to toggle like', 'error');
    }
  };

  const handleAddComment = async (articleId, newComment) => {
    try {
      const updatedComments = await api.addComment(articleId, newComment.author, newComment.text);
      setArticles(prev => prev.map(art => {
        if (art.id === articleId || art._id === articleId || art.slug === articleId) {
          return {
            ...art,
            commentsCount: updatedComments.length,
            comments: updatedComments
          };
        }
        return art;
      }));
      return updatedComments;
    } catch (err) {
      showToast(err.message || 'Failed to add comment', 'error');
      throw err;
    }
  };

  const handleSaveArticle = async (savedArticle) => {
    try {
      let result;
      const isExisting = articles.some(a => a.id === savedArticle.id);
      if (isExisting) {
        result = await api.updateBlog(savedArticle.id, savedArticle);
      } else {
        result = await api.createBlog(savedArticle);
      }
      await fetchBlogs();
    } catch (err) {
      showToast(err.message || 'Failed to save blog to database', 'error');
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await api.deleteBlog(id);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete blog', 'error');
    }
  };

  const totalLikesCount = articles.reduce((acc, a) => acc + (a.likes || 0), 0);
  const totalCommentsCount = articles.reduce((acc, a) => acc + (a.comments?.length || 0), 0);

  const stats = {
    totalPublished: articles.filter(a => a.status === 'Published').length,
    totalLikes: `${(totalLikesCount / 1000).toFixed(1)}K`,
    verifiedComments: totalCommentsCount,
    monthlyAudience: "124.5K",
    topCountryCount: 44
  };

  const searchResults = searchQuery.trim() 
    ? articles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfb] text-[#191919]">
      <ScrollToTop />

      <Navbar 
        currentUser={currentUser}
        onLogout={handleLogout}
        onSearchTrigger={() => setSearchOpen(true)} 
      />

      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <BlogHome 
                articles={articles} 
                likedArticleIds={likedArticleIds}
                onLikeArticle={handleLikeArticle} 
                showToast={showToast} 
              />
            } 
          />
          <Route 
            path="/article/:id" 
            element={
              <ArticleDetail 
                articles={articles} 
                likedArticleIds={likedArticleIds}
                onLikeArticle={handleLikeArticle}
                onAddComment={handleAddComment}
                showToast={showToast}
              />
            } 
          />
          <Route 
            path="/login" 
            element={
              <Login 
                onLogin={handleLogin}
                showToast={showToast}
              />
            } 
          />
          <Route 
            path="/register" 
            element={
              <Register 
                onRegister={handleLogin}
                showToast={showToast}
              />
            } 
          />
          <Route 
            path="/cms" 
            element={
              <ProtectedRoute currentUser={currentUser} showToast={showToast}>
                <CmsDashboard 
                  articles={articles}
                  onDeleteArticle={handleDeleteArticle}
                  showToast={showToast}
                  stats={stats}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cms/new" 
            element={
              <ProtectedRoute currentUser={currentUser} showToast={showToast}>
                <StoryStudio 
                  articles={articles}
                  onSaveArticle={handleSaveArticle}
                  showToast={showToast}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cms/edit/:id" 
            element={
              <ProtectedRoute currentUser={currentUser} showToast={showToast}>
                <StoryStudio 
                  articles={articles}
                  onSaveArticle={handleSaveArticle}
                  showToast={showToast}
                />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer showToast={showToast} currentUser={currentUser} />

      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* QUICK SEARCH OVERLAY MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-neutral-200">
            <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search articles, categories..."
                className="flex-1 bg-transparent text-sm font-medium text-neutral-900 focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-4 space-y-2">
              {searchQuery.trim() === '' ? (
                <p className="text-xs text-neutral-400 text-center py-6">
                  Start typing to search through Wacaiki dispatches...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-6">
                  No articles matched "{searchQuery}".
                </p>
              ) : (
                searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={`/article/${result.id}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{result.category}</span>
                      <h4 className="text-sm font-serif font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                        {result.title}
                      </h4>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
