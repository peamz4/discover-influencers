'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useState, useEffect } from "react";
import { 
  UserCircle, 
  LogOut, 
  Sparkles, 
  Target, 
  Handshake, 
  Briefcase,
  Palette,
  Theater,
  Gamepad2,
  Camera,
  Music,
  UtensilsCrossed,
  Zap
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  const handleDashboardClick = () => {
    if (user?.role === 'ADMIN') {
      router.push('/dashboard');
    } else {
      router.push('/discover');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-[#0a0a1f] via-[#1a1a3e] to-[#2d1b4e]">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl border-b border-gray-800/50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0a0a1f]/30' : 'bg-[#0a0a1f]/95'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-[#00d9ff] to-[#4169e1] rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-[#00d9ff] to-[#4169e1] bg-clip-text text-transparent">
            PRIME
          </span>
          <span className="text-lg font-light text-gray-300">INFLUENCER</span>
        </div>
        <div className="flex items-center gap-6">
          {isAuthenticated && user ? (
            <>
              {user.role === 'ADMIN' && (
                <button
                  onClick={handleDashboardClick}
                  className="text-base text-gray-300 hover:text-[#00d9ff] transition-colors"
                >
                  Dashboard
                </button>
              )}
              <Link href="/discover" className="text-base text-gray-300 hover:text-[#00d9ff] transition-colors">
                Discover
              </Link>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a3e]/60 border border-[#00d9ff]/30 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#00d9ff] to-[#4169e1] flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className="text-xs text-[#00d9ff]">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-[#ff00ff] transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-base text-gray-300 hover:text-[#00d9ff] transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 text-base bg-linear-to-r from-[#00d9ff] to-[#4169e1] text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Fixed Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-r from-[#00d9ff]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-[#ff00ff]/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-linear-to-r from-[#4169e1]/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 gap-4 h-full p-8">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-500/20 transform rotate-45"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 min-h-[calc(100vh-200px)]">
        <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-linear-to-r from-[#ff00ff]/20 to-[#00d9ff]/20 border border-[#00d9ff]/30 rounded-full">
              <span className="text-sm font-medium text-[#00d9ff] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Discover Top Influencers in Thailand
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="bg-linear-to-r from-white via-[#00d9ff] to-[#4169e1] bg-clip-text text-transparent">
                Connect with
              </span>
              <br />
              <span className="text-white">Influential Voices</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl">
              Your premier platform for discovering and collaborating with Thailand&apos;s most engaging content creators across all social media platforms.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {isAuthenticated ? (
                <Link
                  href="/discover"
                  className="px-8 py-4 text-base bg-linear-to-r from-[#00d9ff] to-[#4169e1] text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
                >
                  Explore Influencers
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-8 py-4 text-base bg-linear-to-r from-[#00d9ff] to-[#4169e1] text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 text-base border-2 border-[#00d9ff]/50 text-[#00d9ff] font-semibold rounded-full hover:bg-[#00d9ff]/10 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Animated Connection Visualization */}
            <div className="relative pt-8">
              <div className="flex items-center justify-start gap-2 flex-wrap">
                {/* Pulse Animation for Influencer Hub */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#00d9ff] rounded-full blur-xl opacity-50 group-hover:opacity-75 animate-pulse"></div>
                  <div className="relative px-5 py-2.5 bg-linear-to-r from-[#00d9ff]/20 to-[#4169e1]/20 backdrop-blur-xl border border-[#00d9ff]/50 rounded-full">
                    <span className="text-[#00d9ff] font-semibold text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Influencers
                    </span>
                  </div>
                </div>

                {/* Animated Connection Lines */}
                <div className="hidden md:block relative w-12 h-1">
                  <div className="absolute inset-0 bg-linear-to-r from-[#00d9ff] to-[#ff00ff] animate-pulse"></div>
                  <div className="absolute inset-0 bg-linear-to-r from-[#00d9ff] to-[#ff00ff] blur-sm"></div>
                </div>

                {/* Pulse Animation for Brands */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#ff00ff] rounded-full blur-xl opacity-50 group-hover:opacity-75 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="relative px-5 py-2.5 bg-linear-to-r from-[#ff00ff]/20 to-[#4169e1]/20 backdrop-blur-xl border border-[#ff00ff]/50 rounded-full">
                    <span className="text-[#ff00ff] font-semibold text-sm flex items-center gap-2">
                      <Handshake className="w-4 h-4" />
                      Brands
                    </span>
                  </div>
                </div>

                {/* Animated Connection Lines */}
                <div className="hidden md:block relative w-12 h-1">
                  <div className="absolute inset-0 bg-linear-to-r from-[#ff00ff] to-[#ffd700] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute inset-0 bg-linear-to-r from-[#ff00ff] to-[#ffd700] blur-sm"></div>
                </div>

                {/* Pulse Animation for Success */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#ffd700] rounded-full blur-xl opacity-50 group-hover:opacity-75 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="relative px-5 py-2.5 bg-linear-to-r from-[#ffd700]/20 to-[#ffed4e]/20 backdrop-blur-xl border border-[#ffd700]/50 rounded-full">
                    <span className="text-[#ffd700] font-semibold text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Success
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Stats Ticker */}
              <div className="mt-6">
                <p className="text-base text-gray-400 animate-pulse">
                  Connecting creators with opportunities in real-time
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Influencer Network Illustration */}
          <div className="relative h-[500px] lg:h-[700px] xl:h-[800px] flex items-center justify-center">
            {/* Floating Badge */}
            <div className="absolute top-0 right-0 px-6 py-3 bg-linear-to-r from-[#ff00ff] to-[#00d9ff] rounded-full shadow-2xl shadow-pink-500/50 animate-bounce z-20">
              <span className="text-white font-bold">NEW</span>
            </div>

            {/* Network Illustration Container */}
            <div className="relative w-full max-w-lg h-full flex items-center justify-center">
              {/* Background Glow Effects */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00d9ff]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ff00ff]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

              {/* Central Hub - Brand/Platform */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-[#00d9ff] to-[#4169e1] rounded-full blur-2xl opacity-50 group-hover:opacity-75 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-linear-to-br from-[#00d9ff] to-[#4169e1] rounded-full flex items-center justify-center border-4 border-white/10 shadow-2xl shadow-cyan-500/50">
                    <Zap className="w-12 h-12 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Influencer Node 1 - Top */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '0s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#ff00ff] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-16 h-16 bg-linear-to-br from-[#ff00ff] to-[#ff6b9d] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Briefcase className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-32 text-[#00d9ff]/30" viewBox="0 0 2 128">
                    <line x1="1" y1="0" x2="1" y2="128" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </line>
                  </svg>
                </div>
              </div>

              {/* Influencer Node 2 - Top Right */}
              <div className="absolute top-16 right-12 animate-float" style={{ animationDelay: '0.3s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#4169e1] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-14 h-14 bg-linear-to-br from-[#4169e1] to-[#00d9ff] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Palette className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute top-full left-0 w-24 h-24 text-[#ff00ff]/30 overflow-visible" viewBox="0 0 96 96">
                    <path d="M 12 0 Q 48 48, 60 72" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </path>
                  </svg>
                </div>
              </div>

              {/* Influencer Node 3 - Right */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 animate-float" style={{ animationDelay: '0.6s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#00d9ff] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-16 h-16 bg-linear-to-br from-[#00d9ff] to-[#4169e1] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Theater className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute top-1/2 right-full w-28 h-2 text-[#00d9ff]/30" viewBox="0 0 112 2">
                    <line x1="0" y1="1" x2="112" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </line>
                  </svg>
                </div>
              </div>

              {/* Influencer Node 4 - Bottom Right */}
              <div className="absolute bottom-16 right-12 animate-float" style={{ animationDelay: '0.9s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#ff00ff] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-14 h-14 bg-linear-to-br from-[#ff00ff] to-[#ff6b9d] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Gamepad2 className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute bottom-full left-0 w-24 h-24 text-[#4169e1]/30 overflow-visible" viewBox="0 0 96 96">
                    <path d="M 12 96 Q 48 48, 60 24" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </path>
                  </svg>
                </div>
              </div>

              {/* Influencer Node 5 - Bottom */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '1.2s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#4169e1] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-16 h-16 bg-linear-to-br from-[#4169e1] to-[#00d9ff] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Camera className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute bottom-full left-1/2 -translate-x-1/2 w-1 h-32 text-[#ff00ff]/30" viewBox="0 0 2 128">
                    <line x1="1" y1="128" x2="1" y2="0" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </line>
                  </svg>
                </div>
              </div>

              {/* Influencer Node 6 - Bottom Left */}
              <div className="absolute bottom-16 left-12 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#00d9ff] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-14 h-14 bg-linear-to-br from-[#00d9ff] to-[#4169e1] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Music className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute bottom-full right-0 w-24 h-24 text-[#00d9ff]/30 overflow-visible" viewBox="0 0 96 96">
                    <path d="M 84 96 Q 48 48, 36 24" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </path>
                  </svg>
                </div>
              </div>

              {/* Influencer Node 7 - Left */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 animate-float" style={{ animationDelay: '1.8s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#ff00ff] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-16 h-16 bg-linear-to-br from-[#ff00ff] to-[#ff6b9d] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute top-1/2 left-full w-28 h-2 text-[#ff00ff]/30" viewBox="0 0 112 2">
                    <line x1="0" y1="1" x2="112" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </line>
                  </svg>
                </div>
              </div>

              {/* Influencer Node 8 - Top Left */}
              <div className="absolute top-16 left-12 animate-float" style={{ animationDelay: '2.1s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#4169e1] rounded-full blur-xl opacity-40"></div>
                  <div className="relative w-14 h-14 bg-linear-to-br from-[#4169e1] to-[#00d9ff] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <UtensilsCrossed className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  {/* Connection Line */}
                  <svg className="absolute top-full right-0 w-24 h-24 text-[#4169e1]/30 overflow-visible" viewBox="0 0 96 96">
                    <path d="M 84 0 Q 48 48, 36 72" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </path>
                  </svg>
                </div>
              </div>

              {/* Particle Effects */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#00d9ff] rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-[#ff00ff] rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#4169e1] rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-gray-800/50 bg-[#0a0a1f]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-linear-to-r from-[#00d9ff] to-[#4169e1] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">PM</span>
                </div>
                <span className="text-lg font-bold text-white">PRIME MEDIA</span>
              </div>
              <p className="text-gray-400 text-sm mb-3 max-w-md">
                Your premier platform for discovering and collaborating with Thailand&apos;s most engaging content creators across all social media platforms.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-[#1a1a3e]/80 hover:bg-[#00d9ff]/20 border border-gray-700 hover:border-[#00d9ff]/50 rounded-lg flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-[#00d9ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1a1a3e]/80 hover:bg-[#00d9ff]/20 border border-gray-700 hover:border-[#00d9ff]/50 rounded-lg flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-[#00d9ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1a1a3e]/80 hover:bg-[#00d9ff]/20 border border-gray-700 hover:border-[#00d9ff]/50 rounded-lg flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-[#00d9ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1a1a3e]/80 hover:bg-[#00d9ff]/20 border border-gray-700 hover:border-[#00d9ff]/50 rounded-lg flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-[#00d9ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                    Discover
                  </Link>
                </li>
                {user?.role === 'ADMIN' && (
                  <li>
                    <Link href="/dashboard" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-400 hover:text-[#00d9ff] transition-colors"
                  >
                    Back to Top
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Contact</h3>
              <ul className="space-y-1.5 text-gray-400 text-sm">
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">info@primemedia.com</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">+66 123 456 789</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">Bangkok, Thailand</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} PRIME MEDIA. All rights reserved.
              </p>
              <div className="flex gap-4 text-xs">
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
