import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowRight, Zap } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = await register(name, email, password);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neo-pink/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-neo-pink text-slate-950 border-2 border-slate-950 flex items-center justify-center shadow-neo group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <span className="text-3xl font-display font-black tracking-tight text-white">
              Content<span className="text-neo-pink">IQ</span>
            </span>
          </Link>
          <h2 className="text-2xl font-display font-black text-white mt-4">Create Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Start predicting and optimizing social content performance
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
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  required
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-neo-pink focus:ring-0 transition-colors shadow-neo-sm"
                />
              </div>
            </div>

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
                  placeholder="alex@company.com"
                  required
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-neo-pink focus:ring-0 transition-colors shadow-neo-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-neo-pink focus:ring-0 transition-colors shadow-neo-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-neo-pink focus:ring-0 transition-colors shadow-neo-sm"
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-neo-pink hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

