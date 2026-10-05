import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutGrid, Search, LogIn, LogOut } from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onSearchTrigger }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCmsMode = location.pathname.startsWith('/cms');
  const isAdmin = currentUser?.role === 'Editorial Director';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trends', path: '/?category=Trends' },
    { name: 'Fashion', path: '/?category=Fashion' },
    { name: 'Resources', path: '/?category=Resources' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'CMS Studio', path: '/cms' });
  }

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fbfbfb]/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo - Clickable */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group text-2xl font-bold font-serif tracking-tight text-neutral-900 transition-opacity hover:opacity-85"
            onClick={handleLinkClick}
          >
            <span className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              W
            </span>
            <span>Wacaiki</span>
            {isCmsMode && isAdmin && (
              <span className="ml-2 text-[10px] font-sans font-bold uppercase tracking-widest bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                CMS Studio
              </span>
            )}
          </Link>

          {/* Primary Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-700">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors py-1 ${
                    isActive 
                      ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950' 
                      : 'hover:text-neutral-950'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Trigger */}
            <button
              onClick={onSearchTrigger}
              className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
              title="Search articles"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4" />
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-900 text-xs font-semibold border border-neutral-200">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{currentUser.name}</span>
                  {isAdmin && (
                    <span className="text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Admin
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <Link
                    to={isCmsMode ? '/' : '/cms'}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold transition-colors shadow-xs"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{isCmsMode ? 'Reader View' : 'CMS'}</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onSearchTrigger}
              className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-full"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Drawer */}
          <div className="relative z-10 w-4/5 max-w-sm ml-auto h-full bg-[#fbfbfb] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <Link 
                  to="/" 
                  className="text-xl font-serif font-bold tracking-tight text-neutral-900"
                  onClick={handleLinkClick}
                >
                  Wacaiki
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links List */}
              <nav className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={handleLinkClick}
                      className={`px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                        isActive
                          ? 'bg-neutral-950 text-white font-semibold'
                          : 'text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-neutral-200 flex flex-col gap-3">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-100 mb-2">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-neutral-950 flex items-center gap-1.5">
                        <span>{currentUser.name}</span>
                        {isAdmin && <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">ADMIN</span>}
                      </div>
                      <div className="text-[10px] text-neutral-500">{currentUser.role}</div>
                    </div>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/cms/new"
                      onClick={handleLinkClick}
                      className="w-full text-center py-3 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      + Write New Story
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      onLogout();
                      handleLinkClick();
                      navigate('/');
                    }}
                    className="w-full text-center py-3 rounded-full text-sm font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="w-full text-center py-3 rounded-full text-sm font-semibold bg-neutral-950 text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="w-full text-center py-3 rounded-full text-sm font-semibold border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors"
                  >
                    Register Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
