import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('creator@contentiq.io');
    setPassword('ContentIQ2026!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neo-yellow/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-neo-yellow text-slate-950 border-2 border-slate-950 flex items-center justify-center shadow-neo group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <span className="text-3xl font-display font-black tracking-tight text-white">
              Content<span className="text-neo-yellow">IQ</span>
            </span>
          </Link>
          <h2 className="text-2xl font-display font-black text-white mt-4">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your social media intelligence workspace
          </p>
        </div>

        <Card className="p-6 sm:p-8" glow>
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border-2 border-rose-500 flex items-start gap-3 text-rose-300 text-xs font-bold shadow-neo">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@contentiq.io"
                  required
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-neo-yellow focus:ring-0 transition-colors shadow-neo-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <label className="block text-xs font-black text-slate-200 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-neo-yellow hover:underline cursor-pointer font-bold">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-neo-yellow focus:ring-0 transition-colors shadow-neo-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-6 pt-5 border-t-2 border-slate-800">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-black text-neo-yellow border-2 border-slate-800 hover:border-neo-yellow transition-colors font-mono shadow-neo-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-neo-yellow" />
              <span>One-Click Fill Demo Credentials</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-neo-yellow hover:underline font-bold">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

