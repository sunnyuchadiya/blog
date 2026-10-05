import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, PlusCircle, Eye, Edit3, Trash2, Heart, MessageSquare, 
  Search, Filter, Sparkles, TrendingUp, Users, CheckCircle, Clock 
} from 'lucide-react';

export default function CmsDashboard({ articles, onDeleteArticle, showToast, stats }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    if (deletingId) {
      const artToDelete = articles.find(a => a.id === deletingId);
      onDeleteArticle(deletingId);
      showToast(`Deleted story "${artToDelete?.title || deletingId}".`, 'success');
      setDeletingId(null);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'published' ? art.status === 'Published' :
      activeTab === 'drafts' ? art.status === 'Draft' :
      activeTab === 'scheduled' ? art.status === 'Scheduled' : true;

    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const counts = {
    all: articles.length,
    published: articles.filter(a => a.status === 'Published').length,
    drafts: articles.filter(a => a.status === 'Draft').length,
    scheduled: articles.filter(a => a.status === 'Scheduled').length,
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">
            <span>EDITORIAL MANAGEMENT</span>
            <span>•</span>
            <span className="text-neutral-900 font-bold">WACAIKI CMS</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 tracking-tight">
            Publication Overview & Editorial Suite
          </h1>
          <p className="text-neutral-600 text-sm mt-1">
            Monitor audience engagement, curate fashion dispatches, and oversee global storytelling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4" />
            <span>Live Site View</span>
          </Link>

          <Link
            to="/cms/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create New Story</span>
          </Link>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Published</span>
            <FileText className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900 my-1">
            {stats.totalPublished}
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span>+4 this month</span>
            <span className="text-neutral-400 font-normal">vs prior cycle</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Reader Likes</span>
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900 my-1">
            {stats.totalLikes}
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span>+1.8K this week</span>
            <span className="text-neutral-400 font-normal">engagement spike</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Comments</span>
            <MessageSquare className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900 my-1">
            {stats.verifiedComments}
          </div>
          <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
            <span>98% Approved</span>
            <span className="text-neutral-400 font-normal">active discussion</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Audience</span>
            <Users className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-900 my-1">
            {stats.monthlyAudience}
          </div>
          <div className="text-xs text-neutral-600 font-semibold">
            Across {stats.topCountryCount} luxury markets
          </div>
        </div>

      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'all', label: `All Stories (${counts.all})` },
            { key: 'published', label: `Published (${counts.published})` },
            { key: 'drafts', label: `Drafts (${counts.drafts})` },
            { key: 'scheduled', label: `Scheduled (${counts.scheduled})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, tag, author..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-neutral-950"
          />
        </div>
      </div>

      {/* ARTICLES TABLE */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 font-sans text-[11px] uppercase tracking-wider border-b border-neutral-200">
                <th className="py-3.5 px-6 font-bold">Story Title</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Author</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold text-center">Likes</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs text-neutral-800">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-neutral-500">
                    No articles found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-950 max-w-xs truncate">
                      <Link to={`/article/${art.id}`} className="hover:text-indigo-600 transition-colors">
                        {art.title}
                      </Link>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        art.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                        art.status === 'Draft' ? 'bg-amber-100 text-amber-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {art.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-neutral-600">
                      {art.category}
                    </td>

                    <td className="py-4 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={art.author.avatar} 
                          alt={art.author.name} 
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{art.author.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-neutral-500 whitespace-nowrap">
                      {art.publishedDate}
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-neutral-900">
                      {art.likes}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/article/${art.id}`}
                          className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Preview Story"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/cms/edit/${art.id}`}
                          className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Story"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeletingId(art.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Story"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-neutral-200">
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-2">Delete Story?</h3>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              Are you sure you want to permanently delete this story from the CMS repository? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
