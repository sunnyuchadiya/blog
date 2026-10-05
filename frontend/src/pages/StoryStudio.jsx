import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Cloud, X, Bookmark, ArrowUpRight, CheckCircle2, 
  ChevronDown, Bold, Italic, Quote, Link2, Image as ImageIcon, Info, 
  Sliders, Upload, Maximize2, RefreshCw, Globe, 
  AlertCircle, Sparkles, Film, Tag
} from 'lucide-react';
import { api } from '../api/api';

export default function StoryStudio({ articles = [], onSaveArticle, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const isEditing = Boolean(id);
  const existingArticle = isEditing ? articles.find(a => a.id === id || a._id === id || a.slug === id) : null;

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Fall Collection');
  const [tagsInput, setTagsInput] = useState('');
  const [mediaType, setMediaType] = useState('Image'); // 'Image', 'GIF', 'Video', 'URL'
  const [coverImage, setCoverImage] = useState('');
  const [altText, setAltText] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Published');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [allowSharing, setAllowSharing] = useState(true);
  const [authorName, setAuthorName] = useState('Lindsey Ekstrom');
  const [authorRole, setAuthorRole] = useState('Senior Fashion Editor');

  useEffect(() => {
    if (isEditing && existingArticle) {
      setTitle(existingArticle.title || '');
      setExcerpt(existingArticle.excerpt || '');
      setCategory(existingArticle.category || 'Fall Collection');
      setTagsInput(existingArticle.tags ? existingArticle.tags.join(', ') : '');
      setMediaType(existingArticle.mediaType || 'Image');
      setCoverImage(existingArticle.coverImage || '');
      setContent(existingArticle.content || '');
      setStatus(existingArticle.status || 'Published');
      setAltText(existingArticle.title || 'Editorial still life photograph');
      if (existingArticle.author) {
        setAuthorName(existingArticle.author.name || 'Lindsey Ekstrom');
        setAuthorRole(existingArticle.author.role || 'Senior Fashion Editor');
      }
    } else if (!isEditing) {
      setTitle('The Statement Heels Every Wardrobe Needs This Fall');
      setExcerpt('Discover the must-have heels that elevate any outfit, blending modern architectural lines with timeless Italian craftsmanship.');
      setContent(
        `<p class="text-lg leading-relaxed text-neutral-800 mb-6">As temperatures descend and wardrobe palettes pivot to richer, moodier nuances, footwear emerges as the ultimate fulcrum of seasonal transition. This autumn, shoe designers have discarded sterile minimalism in favor of visceral tactile presence: sculptural heels crafted from brush-finished zinc, supple Tuscan kidskin, and deep midnight velvet accents that capture twilight shadows across city pavements.</p>\n\n<blockquote class="border-l-4 border-neutral-950 pl-6 py-3 my-6 font-serif italic text-xl text-neutral-900 bg-neutral-50 rounded-r-2xl">“Footwear is the architectural punctuation mark of the entire silhouette.”</blockquote>\n\n<p class="text-lg leading-relaxed text-neutral-800 mb-6">The standout silhouette pairs an assertive angled stiletto with a softened, elongated squared toe box—balancing audacity with ergonomic consideration. Whether anchoring tailored cashmere trousers or puncturing the volume of an oversized shearling coat, these statement pieces command the gaze without clamoring for attention.</p>`
      );
      setCoverImage('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&auto=format&fit=crop&q=80');
      setAltText('Burgundy sculptural stiletto heels on Carrara marble pedestal');
    }
  }, [id, existingArticle, isEditing]);

  // Derived Stats
  const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.replace(/<[^>]*>/g, '').length;
  const readCadenceMin = Math.max(1, Math.ceil(wordCount / 180));
  const canonicalSlug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'new-story';

  // Formatting Bar Helper
  const insertFormatting = (syntaxStart, syntaxEnd = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'Sample Text';
    const replacement = `${syntaxStart}${selectedText}${syntaxEnd}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxStart.length, start + syntaxStart.length + selectedText.length);
    }, 0);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    setUploading(true);
    setUploadProgress(15);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 200);

    showToast(`Streaming ${file.name} to Cloudinary...`, 'info');

    try {
      const data = await api.uploadMedia(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setCoverImage(data.url);

      if (file.type.startsWith('video')) {
        setMediaType('Video');
      } else if (file.type === 'image/gif') {
        setMediaType('GIF');
      } else {
        setMediaType('Image');
      }
      showToast('Media asset synchronized to Cloudinary studio storage!', 'success');
    } catch (err) {
      clearInterval(progressInterval);
      showToast(err.message || 'Media upload failed', 'error');
    } finally {
      setTimeout(() => setUploading(false), 500);
    }
  };

  const handleSubmit = async (e, targetStatus) => {
    if (e) e.preventDefault();
    const titleClean = title.trim();
    const excerptClean = excerpt.trim();
    const contentClean = content.trim();

    if (!titleClean || titleClean.length < 3) {
      showToast('Please enter a valid editorial title.', 'error');
      return;
    }
    if (!excerptClean || excerptClean.length < 5) {
      showToast('Please enter a lead synopsis excerpt.', 'error');
      return;
    }
    if (!contentClean || contentClean.length < 10) {
      showToast('Article content cannot be empty.', 'error');
      return;
    }

    const formattedTags = tagsInput
      .split(',')
      .map(t => t.trim().toUpperCase())
      .filter(Boolean);

    const articleData = {
      id: isEditing ? (existingArticle?.id || existingArticle?._id || id) : undefined,
      title: titleClean,
      excerpt: excerptClean,
      category: category,
      tags: formattedTags.length > 0 ? formattedTags : [category.toUpperCase()],
      mediaType: mediaType,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
      content: contentClean,
      status: targetStatus,
      author: {
        name: authorName,
        role: authorRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };

    try {
      await onSaveArticle(articleData);
      showToast(
        targetStatus === 'Published' 
          ? (isEditing ? 'Story updated and published live!' : 'Published live to Wacaiki Editorial catalog!')
          : 'Draft snapshot saved securely to CMS repository.',
        'success'
      );
      navigate('/cms');
    } catch (err) {
      showToast(err.message || 'Failed to save story', 'error');
    }
  };

  const handleDiscard = () => {
    showToast('Discarded unsaved changes. Restored dashboard state.', 'info');
    navigate('/cms');
  };

  if (isEditing && !existingArticle && articles.length > 0) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-2">Monograph Not Found</h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
          The requested monograph ID <code className="bg-neutral-100 px-2 py-1 rounded text-neutral-800">{id}</code> was not found.
        </p>
        <Link to="/cms" className="px-6 py-3 bg-neutral-950 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm">
          Return to CMS Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 pb-20">
      
      {/* 1. TOP EDITORIAL STICKY SUB-HEADER COMMAND BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 border-b border-neutral-200/90 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left info & status indicator */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link 
              to="/cms" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CMS</span>
            </Link>

            <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                {isEditing ? 'Editing Monograph' : 'Post Composition'}
              </span>
              <span className="text-[11px] text-neutral-400 font-mono hidden lg:inline flex items-center gap-1">
                <Cloud className="w-3 h-3 text-emerald-600 inline" />
                Autosaved to Editorial Cloud
              </span>
            </div>
          </div>

          {/* Right Action Command Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button 
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>

            <button 
              type="button"
              onClick={(e) => handleSubmit(e, 'Draft')}
              className="px-5 py-2 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button 
              type="button"
              onClick={(e) => handleSubmit(e, 'Published')}
              className="px-6 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Publish to Wacaiki</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN CANVAS STUDIO CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT STUDIO CONTENT COLUMN (8 COLS ~ 65% width) */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Category Ticker Header Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Editorial Desk</span>
                <div className="relative inline-block">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold px-4 py-2 pr-8 rounded-full cursor-pointer focus:outline-none transition-colors"
                  >
                    <option value="Fall Collection">Fall Collection</option>
                    <option value="Style">Style</option>
                    <option value="Casual Wear">Casual Wear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Runway">Runway</option>
                    <option value="Sustainability">Sustainability</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-neutral-500" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Edition Autumn / Issue No. 42</span>
              </div>
            </div>

            {/* Headline & Synopsis Lead Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter editorial headline..."
                  className="w-full bg-transparent font-serif text-2xl sm:text-4xl font-bold text-neutral-950 placeholder:text-neutral-300 focus:outline-none leading-tight tracking-tight border-b border-neutral-100 pb-2"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  Lead Excerpt & Subtitle *
                </label>
                <textarea
                  rows="2"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Provide a compelling synopsis for curators and patrons..."
                  className="w-full bg-transparent text-base text-neutral-700 placeholder:text-neutral-300 focus:outline-none resize-none leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Rich Editorial WYSIWYG Studio */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col">
              
              {/* WYSIWYG Toolbar */}
              <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <button 
                    type="button" 
                    onClick={() => insertFormatting('<b>', '</b>')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertFormatting('<i>', '</i>')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-neutral-300 mx-1" />
                  <button 
                    type="button" 
                    onClick={() => insertFormatting('<h2 class="text-2xl font-serif font-bold text-neutral-900 mt-6 mb-3">', '</h2>')}
                    className="px-2 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-200 font-serif font-bold text-xs transition-colors"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertFormatting('<h3 class="text-xl font-serif font-bold text-neutral-900 mt-4 mb-2">', '</h3>')}
                    className="px-2 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-200 font-serif font-bold text-xs transition-colors"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <div className="w-px h-4 bg-neutral-300 mx-1" />
                  <button 
                    type="button" 
                    onClick={() => insertFormatting('<blockquote class="border-l-4 border-neutral-950 pl-6 py-2 my-6 font-serif italic text-lg text-neutral-800 bg-neutral-50 rounded-r-2xl">“', '”</blockquote>')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 bg-neutral-200 transition-colors"
                    title="Blockquote"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertFormatting('<a href="#" class="text-indigo-600 underline">', '</a>')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors"
                    title="Insert Hyperlink"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertFormatting('<p class="text-lg leading-relaxed mb-4">', '</p>')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition-colors"
                    title="Paragraph Block"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold">
                  <span>Markdown & HTML Supported</span>
                  <Info className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Textarea Editor */}
              <div className="p-6">
                <textarea
                  ref={textareaRef}
                  rows="14"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write or paste editorial HTML / Markdown story content..."
                  className="w-full text-base font-sans text-neutral-900 leading-relaxed focus:outline-none resize-none min-h-[340px]"
                  required
                />

                {/* Typography Rules & Live Stats Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs text-neutral-500 font-medium">
                  <div className="flex items-center gap-3">
                    <span>Words: <strong>{wordCount}</strong></span>
                    <span>•</span>
                    <span>Characters: <strong>{charCount}</strong></span>
                    <span>•</span>
                    <span>Cadence: <strong>~{readCadenceMin} min read</strong></span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-950 cursor-pointer font-bold">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Typography Rules</span>
                  </span>
                </div>
              </div>

            </div>

          </section>

          {/* RIGHT MEDIA MANAGEMENT & PUBLICATION SETTINGS (4 COLS ~ 35% width) */}
          <section className="lg:col-span-4 space-y-6">
            
            {/* Media Asset Studio Panel */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-neutral-900" />
                  <h2 className="font-serif font-bold text-lg text-neutral-900">Media Asset Studio</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-wider">
                  Hero Media
                </span>
              </div>

              {/* Format Selector Tabs */}
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
                  Select Format
                </span>
                <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-100 rounded-full">
                  {['Image', 'GIF', 'Video', 'URL'].map((type) => {
                    const isSelected = mediaType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMediaType(type)}
                        className={`py-1.5 px-2 rounded-full text-[11px] font-bold text-center transition-all ${
                          isSelected
                            ? 'bg-neutral-950 text-white shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-950'
                        }`}
                      >
                        {isSelected ? '●' : '○'} {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag & Drop Cloudinary Upload Zone */}
              <div className="relative group border-2 border-dashed border-neutral-200 hover:border-neutral-950 rounded-2xl p-6 bg-neutral-50 hover:bg-neutral-100/80 transition-all text-center">
                <label className="cursor-pointer block">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-xs mx-auto mb-3 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs font-bold text-neutral-900 mb-1">
                    Drop high-res editorial asset
                  </p>
                  <p className="text-[11px] text-neutral-500 mb-3 max-w-[200px] mx-auto">
                    JPG, PNG, GIF, MP4, WebM up to 50MB (Streamed to Cloudinary)
                  </p>
                  <span className="px-4 py-1.5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold transition-colors inline-block">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*,.gif"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Active Upload Progress State */}
              {uploading && (
                <div className="p-4 rounded-2xl bg-neutral-950 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold truncate max-w-[160px]">{fileName || 'Uploading asset...'}</span>
                    <span className="text-neutral-400 font-mono">{fileSize || 'Processing'}</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="text-white font-bold flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                      Uploading {uploadProgress}%
                    </span>
                    <span className="italic">Cloudinary CDN stream...</span>
                  </div>
                </div>
              )}

              {/* Active Feature Asset Preview Card */}
              {coverImage && (
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Current Active Feature Asset
                  </span>
                  <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-3/2 group border border-neutral-200">
                    {mediaType === 'Video' ? (
                      <video src={coverImage} controls className="w-full h-full object-cover" />
                    ) : (
                      <img 
                        src={coverImage} 
                        alt={altText || title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 shadow-sm border border-white/20">
                      <Maximize2 className="w-3 h-3 text-indigo-300" />
                      <span>2400 × 1600 px • Aspect 3:2</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Alt Text Caption Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  Alt Text & Editorial Caption
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Burgundy sculptural stiletto heels on marble..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              {/* External Asset URL Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  External Asset CDN Reference / URL
                </label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 absolute left-3 text-neutral-400" />
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or MP4 video URL"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Publication Metadata & Distribution Controls */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <Tag className="w-5 h-5 text-neutral-900" />
                <h2 className="font-serif font-bold text-lg text-neutral-900">Story Metadata & Distribution</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Reading Duration</span>
                  <span className="font-serif font-bold text-base text-neutral-950 mt-0.5">~{readCadenceMin} min read</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Editorial Review</span>
                  <span className="font-bold text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approved
                  </span>
                </div>
              </div>

              {/* Author Profile */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                    alt={authorName} 
                    className="w-10 h-10 rounded-full object-cover border border-neutral-300"
                  />
                  <div>
                    <div className="font-bold text-xs text-neutral-950">{authorName}</div>
                    <div className="text-[10px] text-neutral-500">{authorRole}</div>
                  </div>
                </div>
              </div>

              {/* Topic Tags Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  Topic Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="FALL COLLECTION, STYLE, ACCESSORIES"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 font-mono uppercase"
                />
              </div>

              {/* Canonical SEO Slug */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  Canonical SEO Slug
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-[11px] text-neutral-700 truncate">
                  wacaiki.com/article/{canonicalSlug}
                </div>
              </div>

              {/* Interactive Toggles */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100 cursor-pointer transition-colors">
                  <div className="flex flex-col pr-2">
                    <span className="font-bold text-xs text-neutral-900">Allow Patron Commentary</span>
                    <span className="text-[10px] text-neutral-500">Enable remarks from verified subscribers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="w-4 h-4 accent-neutral-950 cursor-pointer rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100 cursor-pointer transition-colors">
                  <div className="flex flex-col pr-2">
                    <span className="font-bold text-xs text-neutral-900">Social Syndication & Cards</span>
                    <span className="text-[10px] text-neutral-500">Generate dynamic OpenGraph previews</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowSharing}
                    onChange={(e) => setAllowSharing(e.target.checked)}
                    className="w-4 h-4 accent-neutral-950 cursor-pointer rounded"
                  />
                </label>
              </div>

              {/* Launch Timestamp Footer */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 font-medium border-t border-neutral-100">
                <span>Target Launch: Today, 18:00 CET</span>
                <span className="cursor-pointer hover:text-neutral-950 underline font-bold">Scheduled</span>
              </div>

            </div>

          </section>

        </div>
      </div>

    </div>
  );
}
