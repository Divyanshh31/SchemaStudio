import React, { useState } from 'react';
import { Database, ShieldCheck, Lock, Mail, User, Building, ArrowRight, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import InteractiveCanvasBackground from './InteractiveCanvasBackground';

export default function LoginPage({ onLoginSuccess }) {
  const { login, register, loading, authError } = useAuth();
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('divyansh@schemastudio.dev');
  const [password, setPassword] = useState('thakur123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Lead Database Architect');
  const [institution, setInstitution] = useState('SRMIST KTR');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success && onLoginSuccess) onLoginSuccess(res.user);
      else setFormError(res.error);
    } else {
      if (!name) {
        setFormError('Enter your full name');
        return;
      }
      const res = await register({ name, email, password, role, institution });
      if (res.success && onLoginSuccess) onLoginSuccess(res.user);
      else setFormError(res.error);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFormError(null);
    const res = await login(demoEmail, demoPass);
    if (res.success && onLoginSuccess) onLoginSuccess(res.user);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 select-none font-sans bg-[#F5F6F2]">
      <InteractiveCanvasBackground />

      <div className="relative z-10 w-full max-w-md bg-white rounded-md border border-[#DDE0DA] p-6 space-y-5 corner-tick">
        
        {/* Header */}
        <div className="space-y-1 text-left border-b border-[#DDE0DA] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#2454FF] text-white flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-lg font-bold text-[#15181D] font-heading tracking-tight">SchemaStudio</h1>
            <span className="text-[11px] font-mono text-[#7A8087] border border-[#DDE0DA] px-1.5 py-0.5 rounded-sm ml-auto">
              v3.0
            </span>
          </div>
          <p className="text-xs text-[#4B5157]">
            Database schema visualizer, query analyzer, and intelligence workspace.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-[#F5F6F2] p-1 rounded-sm border border-[#DDE0DA] text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('login'); setFormError(null); }}
            className={`flex-1 py-1.5 rounded-sm transition-all ${
              mode === 'login'
                ? 'bg-white text-[#2454FF] font-semibold border border-[#DDE0DA]'
                : 'text-[#4B5157] hover:text-[#15181D]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setFormError(null); }}
            className={`flex-1 py-1.5 rounded-sm transition-all ${
              mode === 'register'
                ? 'bg-white text-[#2454FF] font-semibold border border-[#DDE0DA]'
                : 'text-[#4B5157] hover:text-[#15181D]'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error Alert */}
        {(formError || authError) && (
          <div className="p-3 rounded-sm bg-[#FDF2F4] border border-[#F6BAC4] text-[#D0334C] text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#D0334C]" />
            <span>{formError || authError}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[#4B5157] font-semibold block">Full name</label>
              <input
                type="text"
                required
                placeholder="e.g. Divyansh Thakur"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-sm bg-white border border-[#DDE0DA] text-[#15181D] focus:outline-none focus:border-[#2454FF]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[#4B5157] font-semibold block">Email address</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-white border border-[#DDE0DA] text-[#15181D] focus:outline-none focus:border-[#2454FF]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#4B5157] font-semibold block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-sm bg-white border border-[#DDE0DA] text-[#15181D] focus:outline-none focus:border-[#2454FF] pr-8 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-[#7A8087] hover:text-[#15181D]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[#4B5157] font-semibold block">Role</label>
                <input
                  type="text"
                  placeholder="e.g. Lead DBA"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-white border border-[#DDE0DA] text-[#15181D] focus:outline-none focus:border-[#2454FF]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#4B5157] font-semibold block">Institution</label>
                <input
                  type="text"
                  placeholder="e.g. SRMIST KTR"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-white border border-[#DDE0DA] text-[#15181D] focus:outline-none focus:border-[#2454FF]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-sm bg-[#2454FF] text-white font-semibold text-xs hover:bg-[#1D44D8] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign in to workspace' : 'Create workspace account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-3 border-t border-[#DDE0DA] space-y-2">
          <span className="text-[11px] font-mono text-[#7A8087] block">
            Demo accounts:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-left font-mono text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemo('divyansh@schemastudio.dev', 'thakur123')}
              className="p-2 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] hover:border-[#2454FF] hover:text-[#2454FF] transition-all truncate"
            >
              <div className="font-semibold truncate text-[#15181D]">Divyansh T.</div>
              <div className="text-[10px] text-[#7A8087] truncate">SRMIST KTR</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('sarah@techcorp.io', 'sarah123')}
              className="p-2 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] hover:border-[#2454FF] hover:text-[#2454FF] transition-all truncate"
            >
              <div className="font-semibold truncate text-[#15181D]">Sarah J.</div>
              <div className="text-[10px] text-[#7A8087] truncate">Staff DBA</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('demo@schemastudio.dev', 'demo123')}
              className="p-2 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] hover:border-[#2454FF] hover:text-[#2454FF] transition-all truncate"
            >
              <div className="font-semibold truncate text-[#15181D]">Guest Dev</div>
              <div className="text-[10px] text-[#7A8087] truncate">Demo Studio</div>
            </button>
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="text-center text-[10px] font-mono text-[#7A8087] flex items-center justify-center gap-1.5 pt-1 border-t border-[#DDE0DA]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#159F6B]" />
          <span>Encrypted session • Isolated user storage</span>
        </div>

      </div>
    </div>
  );
}
