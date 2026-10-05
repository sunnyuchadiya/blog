import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, Bookmark, ArrowUpRight, Clock, Sparkles, TrendingUp, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function BlogHome({ articles, likedArticleIds = [], onLikeArticle, showToast }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['All', 'Artificial Intelligence', 'Quantum Computing', 'Cybersecurity', 'Cloud Architecture', 'Web Development', 'Robotics'];

  const publishedArticles = articles.filter(a => a.status === 'Published');
  const filteredArticles = selectedCategory === 'All'
    ? publishedArticles
    : publishedArticles.filter(a => a.category === selectedCategory || a.tags?.includes(selectedCategory.toUpperCase()));

  const heroArticle = articles.find(a => a.isFeatured) || publishedArticles[0];
  const sideArticles = publishedArticles.filter(a => a.id !== heroArticle?.id && a._id !== heroArticle?._id).slice(0, 2);
  const gridArticles = filteredArticles;
  const trendingArticles = publishedArticles.slice(0, 4);

  const toggleBookmark = (id, title, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bId => bId !== id));
      showToast(`Removed "${title}" from saved reading list.`, 'info');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast(`Added "${title}" to your saved reading list!`, 'success');
    }
  };

  const handleLikeClick = (id, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    onLikeArticle(id);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to Wacaiki Weekly Editorial Dispatch!', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
      
      {/* 1. HERO SPOTLIGHT SECTION */}
      <section className="pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Featured Monograph (8 Cols) */}
          {heroArticle && (
            <div className="lg:col-span-8 relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] flex flex-col justify-end p-6 sm:p-10 card-hover-group shadow-lg bg-neutral-900 group">
              <img
                src={heroArticle.coverImage}
                alt={heroArticle.title}
                className="absolute inset-0 w-full h-full object-cover object-center card-zoom-img opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none" />

              <div className="relative z-10 text-white max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/25 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{heroArticle.category}</span>
                  </span>
                  <span className="text-xs text-neutral-300 font-medium">
                    {heroArticle.readTime}
                  </span>
                </div>

                <Link to={`/article/${heroArticle.id || heroArticle._id || heroArticle.slug}`}>
                  <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-serif font-bold tracking-tight leading-snug sm:leading-[1.16] mb-4 hover:underline cursor-pointer">
                    {heroArticle.title}
                  </h1>
                </Link>

                <p className="text-neutral-300 text-sm sm:text-base line-clamp-2 mb-6 font-normal leading-relaxed">
                  {heroArticle.excerpt}
                </p>

                {/* Author & Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20 text-xs text-neutral-300">
                  <div className="flex items-center gap-3">
                    <img 
                      src={heroArticle.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                      alt={heroArticle.author?.name || 'Author'}
                      className="w-9 h-9 rounded-full object-cover border border-white/40 shadow-xs"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{heroArticle.author?.name || 'PARIS EDITORIAL DESK'}</div>
                      <div className="text-[10px] text-neutral-400">{heroArticle.publishedDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => handleLikeClick(heroArticle.id || heroArticle._id || heroArticle.slug, e)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/25 transition-all ${
                        likedArticleIds.includes(heroArticle.id || heroArticle._id) 
                          ? 'bg-rose-600/90 text-white border-rose-500 shadow-rose-900/50' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      aria-label="Like Hero Story"
                    >
                      <Heart className={`w-4 h-4 ${likedArticleIds.includes(heroArticle.id || heroArticle._id) ? 'fill-white text-white' : 'text-rose-400'}`} />
                      <span className="font-bold font-mono">{heroArticle.likes || 0}</span>
                    </button>

                    <button
                      onClick={(e) => toggleBookmark(heroArticle.id || heroArticle._id, heroArticle.title, e)}
                      className={`p-2 rounded-full backdrop-blur-md border border-white/25 transition-colors ${
                        bookmarkedIds.includes(heroArticle.id || heroArticle._id) 
                          ? 'bg-indigo-600 text-white border-indigo-500' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      aria-label="Bookmark Hero Story"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/article/${heroArticle.id || heroArticle._id || heroArticle.slug}`}
                      className="inline-flex items-center justify-center p-2.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-colors shadow-sm"
                      aria-label="Read full monograph"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Stacked Highlight Cards (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {sideArticles.map((art) => (
              <div
                key={art.id || art._id}
                className="relative rounded-3xl overflow-hidden flex-1 min-h-[260px] p-6 flex flex-col justify-end card-hover-group shadow-md bg-neutral-900 group"
              >
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="absolute inset-0 w-full h-full object-cover object-center card-zoom-img opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                <div className="relative z-10 text-white">
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/20 mb-2">
                    {art.category}
                  </span>

                  <Link to={`/article/${art.id || art._id || art.slug}`}>
                    <h3 className="text-base sm:text-lg font-serif font-bold leading-snug line-clamp-2 hover:underline">
                      {art.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20 text-xs text-neutral-300">
                    <span className="text-[11px] text-neutral-400">{art.publishedDate}</span>
                    <Link 
                      to={`/article/${art.id || art._id || art.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-indigo-300 transition-colors"
                    >
                      <span>Read Monograph</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. EDITORIAL PILLARS & METRICS BANNER */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-neutral-950">{publishedArticles.length}</div>
            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">Published Stories</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-indigo-600">124.5K</div>
            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">Monthly Readers</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-600">99.4%</div>
            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">Verified Engagement</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-600">100%</div>
            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">Ethical Coverage</div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY FILTER BAR & EXPLORE EDITIONS */}
      <section id="explore-editions" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Explore Editorial Editions</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Filter dispatches by fashion collection, seasonal trend, or aesthetic monograph.</p>
          </div>
          <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-3.5 py-1.5 rounded-full w-fit">
            {filteredArticles.length} Monograph{filteredArticles.length !== 1 ? 's' : ''} Available
          </span>
        </div>

        {/* Filter Pills Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2.5 p-3 sm:p-4 bg-white rounded-3xl border border-neutral-200/90 shadow-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All'
              ? publishedArticles.length
              : publishedArticles.filter(a => a.category === cat || a.tags?.includes(cat.toUpperCase())).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-950 text-white shadow-md scale-[1.02]'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 border border-neutral-200/60'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-neutral-800 text-amber-300' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ARTICLES GRID */}
        {gridArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200">
            <p className="text-neutral-600 font-medium">No published dispatches match category "{selectedCategory}".</p>
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 px-6 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset to All Editions
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((art) => {
              const artKey = art.id || art._id || art.slug;
              const isLiked = likedArticleIds.includes(artKey) || likedArticleIds.includes(art._id);
              return (
                <article 
                  key={artKey}
                  className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Clickable Image Container */}
                  <Link to={`/article/${artKey}`} className="relative aspect-4/3 overflow-hidden bg-neutral-900 block">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      {art.category}
                    </span>
                    {art.mediaType && (
                      <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-white/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wider">
                        {art.mediaType}
                      </span>
                    )}
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          {art.readTime || '4 min read'}
                        </span>
                        <span>•</span>
                        <span>{art.publishedDate}</span>
                      </div>

                      {/* Clickable Monograph Title */}
                      <Link to={`/article/${artKey}`}>
                        <h3 className="text-xl font-serif font-bold text-neutral-950 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-snug">
                          {art.title}
                        </h3>
                      </Link>

                      <p className="text-neutral-600 text-sm line-clamp-2 font-normal leading-relaxed mb-4">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                      <div className="flex items-center gap-2">
                        <img 
                          src={art.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                          alt={art.author?.name || 'Author'} 
                          className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                        />
                        <span className="font-semibold text-neutral-800 truncate max-w-[110px]">{art.author?.name || 'PARIS DESK'}</span>
                      </div>

                      {/* Like & Bookmark Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLikeClick(artKey, e)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isLiked 
                              ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200 shadow-xs' 
                              : 'hover:text-rose-600 hover:bg-neutral-100 text-neutral-700'
                          }`}
                          aria-label="Like monograph story"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                          <span className="font-mono">{art.likes || 0}</span>
                        </button>

                        <button
                          onClick={(e) => toggleBookmark(artKey, art.title, e)}
                          className={`p-1.5 rounded-full transition-colors ${
                            bookmarkedIds.includes(artKey) ? 'text-indigo-600 bg-indigo-50' : 'hover:text-neutral-950 text-neutral-400'
                          }`}
                          aria-label="Bookmark monograph story"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. FEATURED EDITORIAL DESK BANNER SHOWCASE */}
      <section className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white p-8 sm:p-12 border border-neutral-800 shadow-xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Silicon Valley & Global Tech Selection</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight tracking-tight">
              “Artificial Intelligence and Quantum Computing are re-architecting human capability.”
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Explore our monograph series analyzing agentic AI workflows, fault-tolerant quantum algorithms, and zero-trust security perimeters.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              to="/article/artificial-intelligence-2-0-frontier-neural-reasoning"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-950 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-lg"
            >
              <span>Read Director's Cut</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TRENDING WEEKLY MONOGRAPHS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <h2 className="text-2xl font-serif font-bold text-neutral-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Top Read Dispatches This Week</span>
          </h2>
          <span className="text-xs text-neutral-500">Updated Daily</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArticles.map((art, idx) => (
            <Link
              key={art.id || art._id || idx}
              to={`/article/${art.id || art._id || art.slug}`}
              className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-serif font-bold text-neutral-300 group-hover:text-indigo-600 transition-colors">
                  0{idx + 1}
                </span>
                <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-2 mb-1">
                  {art.category}
                </span>
                <h4 className="font-serif font-bold text-base text-neutral-900 group-hover:underline line-clamp-2 leading-snug">
                  {art.title}
                </h4>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>{art.readTime || '3 min'}</span>
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  {art.likes || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. WEEKLY EDITORIAL DISPATCH NEWSLETTER */}
      <section className="bg-neutral-100 p-8 sm:p-12 rounded-3xl border border-neutral-200 text-center max-w-4xl mx-auto">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-950 text-white mb-2 shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-950 tracking-tight">
            Receive the Wacaiki Dispatch
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
            Join 124,000+ fashion insiders and editors receiving curated monograph essays every Friday directly to your inbox.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You are subscribed to the Wacaiki Dispatch!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white border border-neutral-300 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 shadow-xs"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
