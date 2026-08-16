import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 shadow-glow-brand">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mt-2 mb-8">
        The requested analytics view or route does not exist.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="glow" size="md" icon={Home}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
