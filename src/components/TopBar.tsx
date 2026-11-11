import React from 'react';
import { Heart, Code2, Smartphone, Moon, Sun, SlidersHorizontal } from 'lucide-react';

interface TopBarProps {
  activeTab: 'swipe' | 'explore' | 'matches' | 'profile';
  setActiveTab: (tab: 'swipe' | 'explore' | 'matches' | 'profile') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  showFlutterCode: boolean;
  setShowFlutterCode: (val: boolean) => void;
  deviceMode: 'mobile' | 'pixel' | 'fullscreen';
  setDeviceMode: (mode: 'mobile' | 'pixel' | 'fullscreen') => void;
  onOpenFilter: () => void;
  matchesCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  showFlutterCode,
  setShowFlutterCode,
  deviceMode,
  setDeviceMode,
  onOpenFilter,
  matchesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('swipe');
              setShowFlutterCode(false);
            }}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="font-serif-romance text-xl font-bold tracking-tight text-stone-900 dark:text-white whitespace-nowrap">
              Amora
            </span>
          </button>
        </div>

        {/* Zone 2: Concise Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-300">
          <button
            onClick={() => {
              setActiveTab('swipe');
              setShowFlutterCode(false);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-white pb-0.5 ${
              activeTab === 'swipe' && !showFlutterCode
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-500 font-bold'
                : ''
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => {
              setActiveTab('explore');
              setShowFlutterCode(false);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-white pb-0.5 ${
              activeTab === 'explore' && !showFlutterCode
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-500 font-bold'
                : ''
            }`}
          >
            Explore Passions
          </button>
          <button
            onClick={() => {
              setActiveTab('matches');
              setShowFlutterCode(false);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-white pb-0.5 flex items-center gap-1.5 ${
              activeTab === 'matches' && !showFlutterCode
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-500 font-bold'
                : ''
            }`}
          >
            <span>Conversations</span>
            {matchesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {matchesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              setShowFlutterCode(false);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-white pb-0.5 ${
              activeTab === 'profile' && !showFlutterCode
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-500 font-bold'
                : ''
            }`}
          >
            My Profile
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Device Frame Viewport Switcher */}
          <div className="hidden lg:flex items-center p-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
                deviceMode === 'mobile'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
              }`}
              title="iOS Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iOS</span>
            </button>
            <button
              onClick={() => setDeviceMode('pixel')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
                deviceMode === 'pixel'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
              }`}
              title="Android Pixel Frame"
            >
              <span>Pixel</span>
            </button>
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
                deviceMode === 'fullscreen'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
              }`}
              title="Full Width Web View"
            >
              <span>Full View</span>
            </button>
          </div>

          {/* Quick Filter trigger */}
          <button
            onClick={onOpenFilter}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Filter preferences"
            aria-label="Filter dating preferences"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button: Flutter & Dart Codebase */}
          <button
            onClick={() => setShowFlutterCode(!showFlutterCode)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs ${
              showFlutterCode
                ? 'bg-rose-600 text-white shadow-rose-600/20'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showFlutterCode ? 'Mobile App View' : 'Flutter / Dart Source'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
