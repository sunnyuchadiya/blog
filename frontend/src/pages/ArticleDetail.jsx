import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, MessageSquare, Share2, Bookmark, Headphones, Verified, 
  Calendar, Clock, Eye, ArrowRight, Check, Copy, Printer, Mail, 
  Play, CheckCircle2, XCircle, MoreHorizontal, Reply, ArrowUpRight, 
  Home, ChevronRight, AlertCircle, ArrowLeft, Send
} from 'lucide-react';

export default function ArticleDetail({ articles = [], likedArticleIds = [], onLikeArticle, onAddComment, showToast }) {
  const { id } = useParams();

  // Safe dynamic route lookup by ID, _id, or Slug
  const article = articles.find(a => a.id === id || a._id === id || a.slug === id);

  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState('Most Recent');
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showPulseBadge, setShowPulseBadge] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Scroll reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const progress = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
        setReadProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-2">Monograph Dispatch Not Found</h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
          The requested editorial story does not exist or may have been archived.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal Home</span>
        </Link>
      </div>
    );
  }

  const artKey = article._id || article.id || article.slug;
  const isLiked = likedArticleIds.includes(artKey) || likedArticleIds.includes(article.id) || likedArticleIds.includes(article._id);

  const handleLikeClick = (e) => {
    e?.preventDefault();
    onLikeArticle(artKey);
    if (!isLiked) {
      setShowPulseBadge(true);
      setTimeout(() => setShowPulseBadge(false), 2200);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const nameTrimmed = commentName.trim();
    const textTrimmed = commentText.trim();

    if (!nameTrimmed || nameTrimmed.length < 2) {
      showToast('Please enter your name (at least 2 characters).', 'error');
      return;
    }
    if (!textTrimmed || textTrimmed.length < 3) {
      showToast('Please enter a comment (at least 3 characters).', 'error');
      return;
    }

    try {
      await onAddComment(artKey, {
        author: nameTrimmed,
        text: textTrimmed
      });
      setCommentName('');
      setCommentEmail('');
      setCommentText('');
      showToast('Your response has been published to the discussion studio!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit comment.', 'error');
    }
  };

  // Original real Web Share API with instant Clipboard fallback
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
        showToast('Story shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopySlugLink();
        }
      }
    } else {
      handleCopySlugLink();
    }
  };

  const handleSocialShare = (platform) => {
    const currentUrl = window.location.href;
    const shareTitle = article.title || 'Wacaiki Monograph';
    const shareExcerpt = article.excerpt || article.title;
    const shareMedia = article.coverImage || '';

    let targetUrl = '';

    switch (platform) {
      case 'whatsapp':
        targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${currentUrl}`)}`;
        break;
      case 'twitter':
      case 'x':
        targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'pinterest':
        targetUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(shareMedia)}&description=${encodeURIComponent(shareTitle)}`;
        break;
      case 'facebook':
        targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'linkedin':
        targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      default:
        handleShare();
        return;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
      showToast(`Opening ${platform.toUpperCase()} share dispatch...`, 'success');
    }
  };

  const handleCopySlugLink = () => {
    try {
      const fullUrl = window.location.href;
      navigator.clipboard?.writeText(fullUrl);
      setCopied(true);
      showToast('Permanent editorial link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Unable to copy URL link.', 'error');
    }
  };

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    showToast(
      nextState ? 'Story saved to your archival reading list!' : 'Removed from saved reading list.',
      'success'
    );
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid work email.', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    showToast('Subscribed to Lindsey Ekstrom’s private runway notebook!', 'success');
    setNewsletterEmail('');
  };

  const relatedStories = articles.filter(a => (a.id || a._id) !== artKey && a.status === 'Published').slice(0, 3);

  const renderCoverMedia = () => {
    if (article.mediaType === 'Video') {
      if (article.coverImage.includes('youtube.com') || article.coverImage.includes('youtu.be')) {
        const embedUrl = article.coverImage.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
        return (
          <iframe 
            src={embedUrl} 
            title={article.title}
            className="w-full h-full"
            allowFullScreen
          />
        );
      }
      return (
        <video src={article.coverImage} controls className="w-full h-full object-cover" />
      );
    }

    return (
      <img 
        src={article.coverImage} 
        alt={article.title} 
        className="w-full h-full object-cover object-center"
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-neutral-900">
      
      {/* 1. STICKY READING PROGRESS BAR */}
      <div className="w-full bg-neutral-200 h-1 sticky top-0 z-50">
        <div 
          className="bg-neutral-950 h-full transition-all duration-200 ease-out" 
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        
        {/* 2. BREADCRUMB NAVIGATION */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-xs font-semibold text-neutral-500 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-neutral-950 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to={`/?category=${encodeURIComponent(article.category || 'Fall Collection')}`} className="hover:text-neutral-950 transition-colors">
            {article.category || 'Trends'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-bold truncate max-w-xs md:max-w-md">{article.title}</span>
        </nav>

        {/* 3. ARTICLE HEADER ARCHITECTURE */}
        <header className="max-w-4xl space-y-4 mb-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center bg-neutral-950 text-white font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              {article.category || 'Fall Collection'}
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 font-mono">
              Critique № {article.views ? Math.floor(article.views / 3) + 100 : '408'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-950 tracking-tight leading-[1.12] uppercase">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author Byline & Metadata Card */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <img 
                src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt={article.author?.name || 'Lindsey Ekstrom'}
                className="w-12 h-12 rounded-full object-cover border border-neutral-300 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-neutral-950 text-sm">{article.author?.name || 'Lindsey Ekstrom'}</span>
                  <Verified className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                </div>
                <p className="text-xs text-neutral-500 font-medium">{article.author?.role || 'Senior Footwear & Couture Editor, Paris Bureau'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{article.publishedDate || 'October 18, 2026'}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:inline" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{article.readTime || '4 min read'}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:inline" />
              <div className="flex items-center gap-1.5 text-neutral-950 font-bold">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>{article.views ? `${(article.views / 1000).toFixed(1)}k` : '18.4k'} views</span>
              </div>
            </div>
          </div>
        </header>

        {/* 4. HERO MEDIA ASSET WITH SCRIM & CAPTION */}
        <figure className="w-full relative mb-14">
          <div className="relative w-full aspect-16/9 md:aspect-21/9 rounded-3xl overflow-hidden bg-neutral-950 shadow-lg">
            {renderCoverMedia()}
            
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
              <span className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/20">
                Rue Saint-Honoré Showcase • Edition 09
              </span>
              <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-neutral-300">
                Photography by Matthieu Delon for Wacaiki Studio
              </span>
            </div>
          </div>
          <figcaption className="mt-2.5 text-right text-xs text-neutral-500 font-medium italic">
            Shown above: {article.title} • Hand-buffed haute editorial finish.
          </figcaption>
        </figure>

        {/* 5. CORE LAYOUT GRID: ENGAGEMENT RAIL + ARTICLE PROSE + AUXILIARY WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
          
          {/* LEFT STICKY ENGAGEMENT DOCK (2 COLS) */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 flex lg:flex-col items-center justify-around lg:justify-start gap-4 p-4 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
              
              {/* Like Button */}
              <div className="relative group flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleLikeClick}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xs ${
                    isLiked 
                      ? 'bg-rose-600 text-white shadow-rose-200' 
                      : 'bg-neutral-100 hover:bg-rose-50 text-neutral-700 hover:text-rose-600'
                  }`}
                  aria-label="Like story"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-rose-500'}`} />
                </button>
                <span className="font-bold text-sm text-neutral-950 font-mono mt-1">{article.likes || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Likes</span>

                {/* Pulse badge */}
                {showPulseBadge && (
                  <div className="absolute -top-8 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold whitespace-nowrap shadow-md animate-bounce">
                    +1 Loved!
                  </div>
                )}
              </div>

              <div className="h-8 w-px lg:w-8 lg:h-px bg-neutral-200" />

              {/* Comment Anchor */}
              <a href="#commentsStudio" className="group flex flex-col items-center hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-neutral-100 group-hover:bg-indigo-50 text-neutral-700 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-neutral-950 font-mono mt-1">{article.comments?.length || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Responses</span>
              </a>

              {/* Share Button */}
              <button 
                type="button"
                onClick={handleShare}
                className="group flex flex-col items-center hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 group-hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">Share</span>
              </button>

              {/* Bookmark Toggle */}
              <button 
                type="button"
                onClick={handleToggleBookmark}
                className="group flex flex-col items-center hover:opacity-80 transition-opacity"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isBookmarked ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}>
                  <Bookmark className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  {isBookmarked ? 'Saved' : 'Archive'}
                </span>
              </button>

              {/* Audio Read Aloud Mini-Widget */}
              <div className="hidden lg:flex flex-col items-center pt-2 w-full border-t border-neutral-100 mt-2">
                <div className="w-full bg-neutral-50 rounded-2xl p-2.5 flex flex-col items-center text-center border border-neutral-200/80">
                  <Headphones className="w-4 h-4 text-indigo-600 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Listen</span>
                  <span className="text-xs font-bold text-neutral-900">{article.readTime || '4 min'}</span>
                </div>
              </div>

            </div>
          </aside>

          {/* MAIN ARTICLE CONTENT (7 COLS) */}
          <article className="lg:col-span-7 space-y-8 text-neutral-900">
            
            {/* Story HTML Content */}
            <div 
              className="prose prose-lg max-w-none text-neutral-800 font-sans leading-relaxed space-y-6 text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* THREE ESSENTIAL ARCHETYPES BOX */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <h2 className="text-2xl font-serif font-bold text-neutral-950 uppercase tracking-tight">
                The Three Essential Archetypes
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                To curate your wardrobe for the transition, our style editors dissected over sixty runway debuts to isolate the three key silhouettes driving demand at couture ateliers worldwide.
              </p>
              
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">01 / The Lacquered Oxblood Spool</span>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    A subtle flaring base that yields surprising day-long stability. The deep garnet patina functions as an unexpected neutral against heavy camel hair overcoats.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">02 / The Cantilevered Metallic Wedge</span>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    Engineered with brushed palladium and antique brass inserts, offering the illusion of zero heel support while maintaining complete ergonomic center-of-gravity balance.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">03 / The Square-Cut Chelsea Stiletto</span>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    Sharply chiselled toes meeting a razor-thin 90mm profile. Designed to peak assertively beneath wide, floor-skimming tailored trousers.
                  </p>
                </div>
              </div>
            </div>

            {/* SECONDARY MEDIA BLOCK WITH VIDEO TRIGGER */}
            <div className="relative rounded-3xl overflow-hidden bg-neutral-950 aspect-video group shadow-md border border-neutral-800">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80" 
                alt="Behind the scenes high-fashion workshop video still" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white">
                <button 
                  type="button"
                  onClick={() => showToast('Playing Milan Atelier Craft video...', 'info')}
                  className="w-16 h-16 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mb-3"
                >
                  <Play className="w-7 h-7 translate-x-0.5 fill-neutral-950 text-neutral-950" />
                </button>
                <span className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                  Watch: Behind the Craft in Milan
                </span>
                <span className="text-xs text-neutral-300 mt-2 max-w-sm">
                  4:12 • An exclusive tour inside the artisanal workshop powering Fall’s most viral footwear
                </span>
              </div>
            </div>

            {/* EDITORIAL STYLING PAIRINGS GUIDE */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-serif font-bold uppercase text-neutral-950 tracking-tight">
                Editorial Pairing Protocol
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Pairing an exaggerated heel demands strict attention to hem geometry. Ankle cuts should brush the upper rim of the vamp without bunching, while floor-sweeping skirts require a split vent to showcase the sculpted profile during motion.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-serif font-bold text-sm text-emerald-950">The Do's</span>
                  </div>
                  <ul className="text-xs text-emerald-900 space-y-1.5">
                    <li>• Pair with monochromatic double-faced wool coats.</li>
                    <li>• Embrace sheer ribbed hosiery in charcoal or smoke.</li>
                    <li>• Let the shoe serve as the singular metallic accent.</li>
                  </ul>
                </div>

                <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span className="font-serif font-bold text-sm text-rose-950">The Don'ts</span>
                  </div>
                  <ul className="text-xs text-rose-900 space-y-1.5">
                    <li>• Avoid overly busy brocade bags competing for focus.</li>
                    <li>• Don't hide the ankle under tapered jogger cuffs.</li>
                    <li>• Resist gloss fabrics that conflict with lacquered leather.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ARTICLE HASHTAG CLOUD */}
            <div className="pt-6 border-t border-neutral-200 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2">Dispatches Filed:</span>
              {article.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>

          </article>

          {/* RIGHT COLUMN SHARE & NEWSLETTER SHOWCASE (3 COLS) */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Interactive Share Modal Showcase Box */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <span className="font-serif font-bold text-base text-neutral-900">Share Dispatch</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              </div>
              
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                Distribute this high-fashion critique directly across your professional & aesthetic network.
              </p>

              {/* Quick Social Channels */}
              <div className="grid grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialShare('whatsapp')}
                  className="h-9 rounded-full bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold flex items-center justify-center text-xs transition-colors border border-emerald-200/80"
                  title="Share on WhatsApp"
                >
                  <span>WA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialShare('x')}
                  className="h-9 rounded-full bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-900 font-bold flex items-center justify-center text-xs transition-colors border border-neutral-200"
                  title="Share on X / Twitter"
                >
                  <span>𝕏</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialShare('pinterest')}
                  className="h-9 rounded-full bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-800 font-bold flex items-center justify-center text-xs transition-colors border border-rose-200/80"
                  title="Pin on Pinterest"
                >
                  <span>Pin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialShare('facebook')}
                  className="h-9 rounded-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 font-bold flex items-center justify-center text-xs transition-colors border border-blue-200/80"
                  title="Share to Facebook"
                >
                  <span>FB</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialShare('linkedin')}
                  className="h-9 rounded-full bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-800 font-bold flex items-center justify-center text-xs transition-colors border border-indigo-200/80"
                  title="Post on LinkedIn"
                >
                  <span>IN</span>
                </button>
              </div>

              {/* Copy Link Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Permanent Editorial Slug
                </label>
                <div className="flex items-center gap-1.5 bg-neutral-50 p-1.5 rounded-full border border-neutral-200">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="bg-transparent text-xs text-neutral-800 px-3 w-full focus:outline-none select-all truncate font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopySlugLink}
                    className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Print / Export Actions */}
              <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 font-semibold border-t border-neutral-100">
                <button 
                  type="button"
                  onClick={() => window.print()}
                  className="hover:text-neutral-950 transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
                <a 
                  href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`}
                  className="hover:text-neutral-950 transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Story</span>
                </a>
              </div>
            </div>

            {/* Curated Mini Newsletter Box */}
            <div className="bg-neutral-100 p-6 rounded-3xl border border-neutral-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block">
                Exclusive Briefing
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                Get Lindsey Ekstrom’s private runway notebook delivered each Friday morning.
              </p>
              
              {newsletterSubscribed ? (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-full text-center text-xs font-bold">
                  ✓ Subscribed to Runway Notebook!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1 bg-white rounded-full p-1 border border-neutral-300 shadow-xs">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your work email..."
                    className="bg-transparent text-xs text-neutral-950 placeholder:text-neutral-400 px-3 py-1 focus:outline-none w-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-neutral-950 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>

          </aside>

        </div>

        {/* 6. READER DISCUSSION & COMMENTS STUDIO */}
        <section className="mt-16 pt-10 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs" id="commentsStudio">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-serif font-bold uppercase text-neutral-950">
                  Comments & Perspectives
                </h2>
                <span className="bg-neutral-100 text-neutral-950 font-bold text-xs px-3 py-1 rounded-full">
                  {article.comments?.length || 0}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-medium">
                Join the ongoing critique with global fashion directors, stylists, and enthusiasts.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
              <span>Sort by:</span>
              <select 
                value={commentSort}
                onChange={(e) => setCommentSort(e.target.value)}
                className="bg-neutral-100 text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full focus:outline-none"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Top Voted">Top Voted</option>
                <option value="Editorial Staff First">Editorial Staff First</option>
              </select>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCommentSubmit} className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200/80 my-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
              Contribute to the Archive
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full bg-white px-4 py-2.5 rounded-xl text-xs text-neutral-950 border border-neutral-200 focus:outline-none focus:border-neutral-950 shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Email (Strictly confidential)
                </label>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="elena.vance@studio.ch"
                  className="w-full bg-white px-4 py-2.5 rounded-xl text-xs text-neutral-950 border border-neutral-200 focus:outline-none focus:border-neutral-950 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Your Critique or Inquiry *
              </label>
              <textarea
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this editorial..."
                className="w-full bg-white p-4 rounded-2xl text-xs text-neutral-950 border border-neutral-200 focus:outline-none focus:border-neutral-950 resize-none shadow-xs"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-neutral-500">Wacaiki follows strict editorial moderation guidelines.</p>
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2"
              >
                <span>Post Comment</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-6">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comm, idx) => (
                <article key={comm._id || comm.id || idx} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={comm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
                        alt={comm.author}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-300"
                      />
                      <div>
                        <span className="font-bold text-sm text-neutral-950 block leading-tight">{comm.author}</span>
                        <span className="text-[11px] text-neutral-400">{comm.date || 'Oct 5, 2026'} • Verified Reader</span>
                      </div>
                    </div>
                    <button type="button" className="text-neutral-400 hover:text-neutral-950">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-800 leading-relaxed sm:pl-13">
                    {comm.text}
                  </p>
                  <div className="flex items-center gap-6 sm:pl-13 pt-1 text-xs text-neutral-500 font-semibold">
                    <button 
                      type="button" 
                      onClick={() => showToast('Liked response!', 'success')}
                      className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>12 likes</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => showToast('Reply thread initialized.', 'info')}
                      className="flex items-center gap-1 hover:text-neutral-950 transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-neutral-500 text-xs text-center py-6">No responses yet. Be the first to join the conversation!</p>
            )}
          </div>

        </section>

        {/* 7. RECOMMENDED DISPATCHES */}
        <section className="mt-20 pt-10 border-t border-neutral-200">
          <div className="flex flex-wrap items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block">Curated Continuity</span>
              <h2 className="text-2xl font-serif font-bold uppercase text-neutral-950 mt-1">Recommended Dispatches</h2>
            </div>
            <Link to="/" className="text-xs font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 transition-colors">
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedStories.map((rel) => {
              const relKey = rel.id || rel._id || rel.slug;
              return (
                <article key={relKey} className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <Link to={`/article/${relKey}`} className="relative aspect-4/3 overflow-hidden bg-neutral-950 block">
                      <img 
                        src={rel.coverImage} 
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/20">
                        {rel.category}
                      </span>
                    </Link>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span className="font-bold uppercase tracking-wider text-indigo-600">{rel.publishedDate}</span>
                        <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <Link to={`/article/${relKey}`}>
                        <h3 className="font-serif font-bold text-base text-neutral-950 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-600 line-clamp-2 font-normal leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex items-center justify-between text-xs text-neutral-500 font-medium border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <img 
                        src={rel.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                        alt={rel.author?.name || 'Author'}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-neutral-900 truncate max-w-[100px]">{rel.author?.name || 'PARIS DESK'}</span>
                    </div>
                    <span>{rel.readTime || '4 min'}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
