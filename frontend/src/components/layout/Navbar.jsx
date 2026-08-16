import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sparkles, User, Bell, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isMockMode } from '../../services/api';

export function Navbar({ onMenuToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const mockActive = isMockMode();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/analytics':
        return 'Analytics & Performance Charts';
      case '/insights':
        return 'AI Content Insights';
      case '/recommendations':
        return 'Ranked Content Recommendations';
      case '/predict':
        return 'Performance Predictor';
      case '/simulator':
        return 'Scenario Simulator';
      case '/strategy':
        return 'Weekly Content Strategy';
      case '/upload':
        return 'Dataset Upload & Validation';
      case '/profile':
        return 'User & API Profile';
      default:
        return 'ContentIQ';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0F172A] border-b-[2.5px] border-black px-4 sm:px-6 py-3 flex items-center justify-between shadow-neo-sm">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-1.5 rounded-xl bg-[#FFD12E] border-2 border-black shadow-neo-sm text-slate-950 lg:hidden neo-interactive-press"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#FF6B97] border border-black" />
            <span className="w-3 h-3 rounded-full bg-[#FFD12E] border border-black" />
            <span className="w-3 h-3 rounded-full bg-[#2DD4BF] border border-black" />
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight font-display">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Engine status badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1E293B] border-2 border-black shadow-neo-sm text-xs text-slate-200">
          <span
            className={`w-2.5 h-2.5 rounded-full border border-black ${
              mockActive ? 'bg-[#FFD12E] animate-pulse' : 'bg-[#2DD4BF] animate-pulse'
            }`}
          />
          <span className="text-[11px] font-bold font-mono">
            {mockActive ? 'MOCK ENGINE' : 'FASTAPI LIVE'}
          </span>
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-2 p-1 sm:px-3 sm:py-1 rounded-xl bg-[#FFFDF5] text-slate-950 border-2 border-black shadow-neo-sm hover:bg-[#FEF9C3] transition-all neo-interactive-press"
        >
          <div className="w-6 h-6 rounded-lg bg-[#FF6B97] border border-black text-white flex items-center justify-center font-black text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline text-xs font-black">
            {user?.name || 'Account'}
          </span>
        </Link>
      </div>
    </header>
  );
}
