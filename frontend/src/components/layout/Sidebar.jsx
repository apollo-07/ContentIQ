import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  Sparkles,
  Zap,
  Sliders,
  CalendarDays,
  UploadCloud,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { isMockMode } from '../../services/api';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, tag: '01' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, tag: '02' },
  { name: 'Insights', path: '/insights', icon: Lightbulb, tag: '03' },
  { name: 'Recommendations', path: '/recommendations', icon: Sparkles, tag: '04' },
  { name: 'Predict', path: '/predict', icon: Zap, tag: '05' },
  { name: 'Simulator', path: '/simulator', icon: Sliders, tag: '06' },
  { name: 'Strategy', path: '/strategy', icon: CalendarDays, tag: '07' },
  { name: 'Upload Data', path: '/upload', icon: UploadCloud, tag: '08' },
  { name: 'Profile', path: '/profile', icon: User, tag: '09' },
];

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const mockActive = isMockMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0F172A] border-r-[2.5px] border-black z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-neo-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Checkerboard Accent Ribbon (Inspired by Reference Image 1) */}
        <div className="h-3 w-full checker-ribbon border-b-2 border-black flex-shrink-0" />

        {/* Brand Header */}
        <div className="p-4 border-b-[2.5px] border-black bg-[#151D2C] flex items-center justify-between flex-shrink-0">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 group"
            onClick={() => onClose && onClose()}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD12E] border-2 border-black shadow-neo-sm p-0.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 fill-black" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white font-display flex items-center gap-1">
                Content<span className="text-[#FFD12E]">IQ</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">
                Chaos Intelligence AI
              </span>
            </div>
          </NavLink>

          <div className="hidden sm:flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#FF6B97] border border-black" />
            <span className="w-3 h-3 rounded-full bg-[#FFD12E] border border-black" />
            <span className="w-3 h-3 rounded-full bg-[#2DD4BF] border border-black" />
          </div>
        </div>

        {/* Engine Status Tag */}
        <div className="px-3 pt-3 pb-1 flex-shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-[#1E293B] border-2 border-black shadow-neo-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full border border-black ${
                  mockActive ? 'bg-[#FFD12E] animate-pulse' : 'bg-[#2DD4BF] animate-pulse'
                }`}
              />
              <span className="text-white font-bold font-mono text-[11px]">
                {mockActive ? 'Mock Engine' : 'FastAPI Live'}
              </span>
            </div>
            <NavLink
              to="/profile"
              className="text-[10px] text-[#38BDF8] hover:underline font-bold font-mono uppercase"
            >
              Config
            </NavLink>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
          <div className="px-2 pb-1 text-[10px] font-black font-mono uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black transition-all border-2 ${
                    isActive
                      ? 'bg-[#FFD12E] text-slate-950 border-black shadow-neo-sm translate-x-1'
                      : 'bg-transparent text-slate-300 border-transparent hover:bg-[#1E293B] hover:border-black hover:shadow-neo-sm'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] font-mono opacity-80 border border-black/40 px-1 py-0.2 rounded bg-black/10">
                  {item.tag}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-3 border-t-[2.5px] border-black bg-[#151D2C] flex-shrink-0 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#1E293B] border-2 border-black shadow-neo-sm">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B97] border-2 border-black flex items-center justify-center font-black text-white text-xs flex-shrink-0 shadow-[1px_1px_0px_#000]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate">{user?.name || 'Creator'}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'user@contentiq.io'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-[#EF4444] border-2 border-black shadow-neo-sm hover:bg-[#DC2626] transition-all neo-interactive-press"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Bottom Checkerboard Accent Ribbon */}
        <div className="h-2 w-full checker-ribbon-yellow border-t-2 border-black flex-shrink-0" />
      </aside>
    </>
  );
}
