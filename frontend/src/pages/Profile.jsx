import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isMockMode, setMockMode, checkBackendHealth } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  User,
  Shield,
  Server,
  Activity,
  Key,
  CheckCircle2,
  AlertCircle,
  Radio,
  RefreshCw,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [mockActive, setMockActive] = useState(isMockMode());
  const [pingStatus, setPingStatus] = useState({ tested: false, online: false, latency: null, error: null });
  const [testingPing, setTestingPing] = useState(false);
  const [customApiUrl] = useState(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  );

  const handleToggleMock = (enabled) => {
    setMockMode(enabled);
    setMockActive(enabled);
    window.location.reload(); // Refresh to update all API service states cleanly
  };

  const handleTestConnection = async () => {
    setTestingPing(true);
    const result = await checkBackendHealth();
    setPingStatus({
      tested: true,
      online: result.online,
      latency: result.latency,
      error: result.error,
    });
    setTestingPing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neo-yellow/20 border-2 border-neo-yellow text-neo-yellow text-xs font-black uppercase tracking-wider mb-2">
          <User className="w-3.5 h-3.5" />
          Settings & Runtime
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
          User Profile & API Architecture
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account credentials, live FastAPI backend connections, and mock mode runtime preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Account Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-neo-yellow text-slate-950 border-2 border-slate-950 p-0.5 mx-auto shadow-neo flex items-center justify-center">
              <span className="font-display font-black text-3xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-display font-black text-white tracking-tight">{user?.name || 'Alex Rivera'}</h3>
              <p className="text-xs text-slate-400 font-mono">{user?.email || 'creator@contentiq.io'}</p>
              <Badge variant="sticker" colorIndex={0} size="xs" className="mt-2">
                {user?.role || 'Content Strategist'}
              </Badge>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border-2 border-slate-800 text-left space-y-2.5 text-xs shadow-neo-sm font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">USER ID:</span>
                <span className="text-white font-bold">{user?.id || 'usr_99812'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">ORG:</span>
                <span className="text-white font-bold">{user?.company || 'Aura Media Labs'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">AUTH:</span>
                <span className="text-neo-mint font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-rose-400 border-rose-500/50 hover:bg-rose-500/10"
              icon={LogOut}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </Card>
        </div>

        {/* Backend & API Integration Settings */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="BACKEND INTEGRATION & MOCK ENGINE"
            subtitle="Developer 1 collaboration & API configuration switch"
            icon={Server}
          >
            <div className="space-y-6 mt-4">
              {/* Mock vs Live Switcher */}
              <div className="p-4 rounded-xl bg-slate-900 border-2 border-slate-800 space-y-3 shadow-neo-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2 font-display">
                      <Radio className="w-4 h-4 text-neo-yellow" />
                      Active Data Source Engine
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Toggle between realistic offline mock data and live Developer 1 FastAPI backend.
                    </p>
                  </div>
                  <Badge variant={mockActive ? 'yellow' : 'emerald'} size="sm" dot>
                    {mockActive ? 'MOCK ENGINE' : 'LIVE BACKEND'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleMock(true)}
                    className={`p-3.5 rounded-xl border-2 text-left text-xs transition-all ${
                      mockActive
                        ? 'bg-neo-yellow text-slate-950 border-slate-950 shadow-neo font-bold scale-[1.02]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-display font-black block text-sm mb-0.5">Mock API Mode</span>
                    <span className={`text-[11px] block ${mockActive ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                      Works 100% offline with verified dataset schemas.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleMock(false)}
                    className={`p-3.5 rounded-xl border-2 text-left text-xs transition-all ${
                      !mockActive
                        ? 'bg-emerald-400 text-slate-950 border-slate-950 shadow-neo font-bold scale-[1.02]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-display font-black block text-sm mb-0.5">Live FastAPI Backend</span>
                    <span className={`text-[11px] block ${!mockActive ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                      Sends real HTTP calls to Developer 1 endpoints.
                    </span>
                  </button>
                </div>
              </div>

              {/* Endpoint Health Checker */}
              <div className="p-4 rounded-xl bg-slate-900 border-2 border-slate-800 space-y-3 shadow-neo-sm">
                <h4 className="text-sm font-black text-white flex items-center gap-2 font-display">
                  <Activity className="w-4 h-4 text-neo-mint" />
                  FastAPI Server Connection Test
                </h4>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-300 truncate">
                    {customApiUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    isLoading={testingPing}
                    icon={RefreshCw}
                  >
                    Ping Server
                  </Button>
                </div>

                {pingStatus.tested && (
                  <div
                    className={`p-3 rounded-xl border-2 text-xs flex items-center gap-2.5 shadow-neo-sm font-mono font-bold ${
                      pingStatus.online
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                        : 'bg-amber-500/10 border-neo-yellow text-neo-yellow'
                    }`}
                  >
                    {pingStatus.online ? (
                      <CheckCircle2 className="w-4 h-4 text-neo-mint flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-neo-yellow flex-shrink-0" />
                    )}
                    <span>
                      {pingStatus.online
                        ? `Connected! Backend latency: ${pingStatus.latency}ms`
                        : `Backend server at ${customApiUrl} is currently offline. Mock mode active.`}
                    </span>
                  </div>
                )}
              </div>

              {/* Active JWT Token Details */}
              <div className="p-4 rounded-xl bg-slate-900 border-2 border-slate-800 space-y-2 shadow-neo-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
                  <Key className="w-3.5 h-3.5 text-neo-pink" />
                  Bearer Authorization Token Header
                </h4>
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-[11px] font-mono text-slate-400 break-all">
                  {token ? `Bearer ${token}` : 'No active token'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

