import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { api } from '../api/api';

export default function Register({ onRegister, showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Reader');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || cleanName.length < 2) {
      const err = 'Please enter your full name (at least 2 characters).';
      setErrorMsg(err);
      showToast(err, 'error');
      return;
    }

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      const err = 'Please enter a valid email address.';
      setErrorMsg(err);
      showToast(err, 'error');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      const err = 'Password must be at least 4 characters long.';
      setErrorMsg(err);
      showToast(err, 'error');
      return;
    }

    setLoading(true);
    try {
      const registeredUser = await api.register(cleanName, cleanEmail, cleanPassword, role);
      onRegister(registeredUser);
      showToast(`Account registered successfully as ${registeredUser.role}!`, 'success');
      navigate('/cms');
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neutral-950 text-white font-serif text-2xl font-bold mb-4 shadow-sm">
            W
          </div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            Create Editorial Account
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Join the Wacaiki publishing platform & studio team
          </p>
        </div>

        {/* Inline Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle to Login */}
        <div className="mt-6 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-neutral-950 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
