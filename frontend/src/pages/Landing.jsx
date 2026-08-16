import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  BarChart3,
  Zap,
  Sliders,
  CalendarDays,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Smile,
  Shield,
  Layers,
} from 'lucide-react';

export function Landing() {
  const features = [
    {
      number: '01',
      title: 'Deep Multi-Dimensional Analytics',
      desc: 'Understand what works across content formats, topical categories, days of week, and peak hourly engagement windows.',
      color: 'yellow',
      bg: 'bg-[#FFD12E]',
      icon: BarChart3,
    },
    {
      number: '02',
      title: 'ML Performance Prediction',
      desc: 'Predict post success probability (LOW / MEDIUM / HIGH) before publishing using machine learning trained on historical reach.',
      color: 'pink',
      bg: 'bg-[#FF6B97]',
      icon: Zap,
    },
    {
      number: '03',
      title: 'Scenario Simulator',
      desc: 'Simulate and compare multiple campaign variations side-by-side to select the highest-performing content parameters.',
      color: 'mint',
      bg: 'bg-[#2DD4BF]',
      icon: Sliders,
    },
    {
      number: '04',
      title: 'Algorithmic Content Strategy',
      desc: 'Generate an optimal 7-day publishing schedule maximized for audience retention and algorithm recommendation score.',
      color: 'blue',
      bg: 'bg-[#38BDF8]',
      icon: CalendarDays,
    },
    {
      number: '05',
      title: 'Ranked AI Recommendations',
      desc: 'Receive clear, actionable, and ranked suggestions backed by transparent data-driven reasoning.',
      color: 'purple',
      bg: 'bg-[#C084FC]',
      icon: Sparkles,
    },
    {
      number: '06',
      title: 'Instant CSV Ingestion & Quality Audit',
      desc: 'Drag and drop your social export data with real-time client validation of rows, duplicates, missing cells, and schema errors.',
      color: 'cream',
      bg: 'bg-[#FFFDF5]',
      icon: UploadCloud,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D1321] bg-dot-pattern text-slate-100 selection:bg-[#FFD12E] selection:text-black">
      {/* Top Checkerboard Accent Ribbon */}
      <div className="h-3 w-full checker-ribbon border-b-2 border-black" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#0F172A] border-b-[2.5px] border-black shadow-neo-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD12E] border-2 border-black shadow-neo-sm p-0.5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-950 fill-black" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-display">
              Content<span className="text-[#FFD12E]">IQ</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="yellow" size="sm" icon={ArrowRight} iconPosition="right">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Sticker Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD12E] text-slate-950 border-2 border-black shadow-neo font-black text-xs uppercase tracking-wider mb-6 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>Social Intelligence AI & Content Optimization</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight font-display">
            Unlock High-Impact <br />
            <span className="inline-block bg-[#FF6B97] text-white px-4 py-1 rounded-2xl border-2 border-black shadow-neo-lg rotate-[-1deg] mt-2">
              Content Performance
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            ContentIQ analyzes audience behavioral signals, forecasts post engagement with machine
            learning, and generates intelligent weekly publishing schedules.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="yellow" size="lg" icon={TrendingUp} iconPosition="left">
                Launch Live Dashboard
              </Button>
            </Link>
            <Link to="/predict">
              <Button variant="pink" size="lg" icon={Zap} iconPosition="left">
                Test ML Predictor
              </Button>
            </Link>
          </div>

          {/* Retro Window Champion Preview Card (Inspired by Inspo Image 1 & 4) */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="rounded-3xl border-[3px] border-black bg-[#151D2C] shadow-neo-xl overflow-hidden text-left">
              {/* Window Header */}
              <div className="bg-[#1E293B] border-b-[3px] border-black px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-[#FFD12E] border border-black inline-flex items-center justify-center text-[9px] font-black text-black select-none">
                      -
                    </span>
                    <span className="w-4 h-4 rounded-md bg-[#2DD4BF] border border-black inline-flex items-center justify-center text-[8px] font-black text-black select-none">
                      □
                    </span>
                    <span className="w-4 h-4 rounded-md bg-[#FF6B97] border border-black inline-flex items-center justify-center text-[9px] font-black text-white select-none">
                      ✕
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black font-mono text-white tracking-wide">
                    MEET YOUR CONTENT STRATEGY CHAMPION!
                  </span>
                </div>
                <Badge variant="mint" size="xs">
                  AI ONLINE
                </Badge>
              </div>

              {/* Window Body Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0D1321]">
                {/* Left Stats Column */}
                <div className="md:col-span-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-[#FFFDF5] text-slate-950 border-2 border-black shadow-neo-sm">
                    <span className="text-[10px] font-black uppercase tracking-wider font-mono text-slate-500 block">
                      TOP PERFORMING FORMAT
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-extrabold font-display">Reels (Short Video)</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#2DD4BF] text-slate-950 font-black text-xs border border-black">
                        8.2% Avg
                      </span>
                    </div>
                  </div>

                  {/* Segmented Speed / Probability Bar (Image 1 inspo) */}
                  <div className="p-4 rounded-2xl bg-[#1E293B] border-2 border-black shadow-neo-sm space-y-2">
                    <div className="flex justify-between text-xs font-bold font-mono">
                      <span className="text-slate-300">VIRAL VELOCITY:</span>
                      <span className="text-[#2DD4BF]">88% [OPTIMAL]</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-black rounded-xl border border-black">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-3 rounded ${
                            i < 10 ? 'bg-[#2DD4BF]' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Segmented Power Bar (Image 1 inspo) */}
                  <div className="p-4 rounded-2xl bg-[#1E293B] border-2 border-black shadow-neo-sm space-y-2">
                    <div className="flex justify-between text-xs font-bold font-mono">
                      <span className="text-slate-300">ENGAGEMENT POWER:</span>
                      <span className="text-[#FF6B97]">94% [HIGH]</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-black rounded-xl border border-black">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-3 rounded ${
                            i < 11 ? 'bg-[#FF6B97]' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Bio & Advice Column */}
                <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                  <div className="p-5 rounded-2xl bg-[#FFFDF5] text-slate-950 border-2 border-black shadow-neo-sm flex-1">
                    <span className="text-[10px] font-black font-mono uppercase tracking-wider text-slate-500 block mb-2">
                      BIO & STRATEGY DIRECTIVE:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed italic">
                      "Thinks every post is a royal community tournament. Posts behind-the-scenes reels on Saturday at 19:00 UTC and dominates audience discovery algorithms."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#FFD12E] text-slate-950 border-2 border-black shadow-neo-sm text-center">
                      <span className="text-[10px] font-black uppercase font-mono block">500+ POSTS</span>
                      <span className="text-sm font-extrabold font-display">Analyzed</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#2DD4BF] text-slate-950 border-2 border-black shadow-neo-sm text-center">
                      <span className="text-[10px] font-black uppercase font-mono block">RANDOM FOREST</span>
                      <span className="text-sm font-extrabold font-display">ML Engine</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infographic Features Grid (Inspired by Inspo Images 2, 3, 4) */}
      <section className="py-20 bg-[#0F172A] border-y-[2.5px] border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="yellow" size="md">
              CORE CAPABILITIES
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight font-display">
              Built for High-Growth Creators
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">
              Data science rigor disguised in an intuitive, delightful creator workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.number}
                  className="rounded-2xl border-[2.5px] border-black bg-[#FFFDF5] text-slate-950 p-6 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-black text-white font-black font-mono text-sm flex items-center justify-center shadow-neo-sm">
                      {feat.number}
                    </span>
                    <div className={`p-2.5 rounded-xl ${feat.bg} border-2 border-black shadow-neo-sm text-slate-950`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black tracking-tight font-display mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-[3px] border-black bg-[#FFD12E] text-slate-950 p-8 sm:p-12 text-center shadow-neo-xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
              Ready to Upgrade Your Social Content IQ?
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-800 max-w-xl mx-auto mt-3 mb-8">
              Explore your social dataset or start testing with our built-in realistic mock data suite.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="pink" size="lg">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/upload">
                <Button variant="cream" size="lg" icon={UploadCloud}>
                  Upload Social Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Checkerboard Accent Ribbon */}
      <div className="h-3 w-full checker-ribbon-yellow border-t-2 border-black" />

      {/* Footer */}
      <footer className="py-8 bg-[#0F172A] text-center text-xs text-slate-400 font-mono">
        <p>© 2026 ContentIQ Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
