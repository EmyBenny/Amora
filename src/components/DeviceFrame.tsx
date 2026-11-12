import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  deviceMode: 'mobile' | 'pixel';
  onToggleDeviceMode?: () => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceMode,
  onToggleDeviceMode,
  children,
}) => {
  const isIos = deviceMode === 'mobile';

  return (
    <div className="flex-1 w-full flex items-center justify-center p-0 sm:py-6 sm:px-4 bg-stone-100/70 dark:bg-stone-950/90 overflow-x-hidden min-h-screen">
      {/* Sleek Mobile Container */}
      <div
        className={`relative w-full max-w-[425px] h-screen sm:h-[844px] flex flex-col bg-white dark:bg-stone-900 overflow-hidden shadow-2xl transition-all duration-300 ${
          isIos
            ? 'sm:rounded-[44px] border border-stone-200/80 dark:border-stone-800'
            : 'sm:rounded-[36px] border border-stone-200/80 dark:border-stone-800'
        }`}
      >
        {/* Frame Top Status Bar (Phone OS status bar) */}
        <div className="relative z-30 shrink-0 h-10 px-5 flex items-center justify-between text-[11px] font-semibold text-stone-900 dark:text-white bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-100 dark:border-stone-800/80 select-none">
          {/* Left: Clock */}
          <span className="font-medium tracking-tight text-stone-700 dark:text-stone-300">
            {isIos ? '9:41' : '10:00'}
          </span>

          {/* Center: Device Notch / Camera */}
          {isIos ? (
            <div className="w-24 h-4 bg-stone-950 dark:bg-black rounded-full flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 rounded-full bg-stone-800 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-sky-950" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 bg-stone-950 dark:bg-black rounded-full border border-stone-700/50 shadow-inner" />
          )}

          {/* Right: Platform switcher + Telemetry */}
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            {onToggleDeviceMode && (
              <button
                onClick={onToggleDeviceMode}
                className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[10px] font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                title="Toggle between iOS and Pixel view"
              >
                {isIos ? 'iOS' : 'Pixel'}
              </button>
            )}
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mobile Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-hidden bg-stone-50 dark:bg-stone-900">
          {children}
        </div>

        {/* Bottom Platform Gesture Bar */}
        <div className="shrink-0 h-5 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-850 flex items-center justify-center pointer-events-none">
          {isIos ? (
            <div className="w-32 h-1 bg-stone-400/80 dark:bg-stone-600 rounded-full" />
          ) : (
            <div className="w-20 h-1 bg-stone-400/80 dark:bg-stone-600 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};
