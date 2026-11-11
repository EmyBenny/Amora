import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  deviceMode: 'mobile' | 'pixel' | 'fullscreen';
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceMode,
  children,
}) => {
  if (deviceMode === 'fullscreen') {
    return (
      <div className="w-full min-h-[calc(100vh-3.5rem)] bg-stone-50 dark:bg-stone-950 flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col px-3 sm:px-6 py-4">
          {children}
        </div>
      </div>
    );
  }

  const isIos = deviceMode === 'mobile';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-4 sm:py-8 px-2 flex items-center justify-center bg-stone-100 dark:bg-stone-950/70 overflow-x-hidden">
      {/* Smartphone Chassis */}
      <div
        className={`relative w-full max-w-[400px] h-[780px] sm:h-[830px] rounded-[44px] shadow-2xl transition-all duration-300 border-[9px] flex flex-col overflow-hidden bg-stone-900 ${
          isIos
            ? 'border-stone-800 dark:border-stone-700 shadow-stone-900/40 ring-1 ring-white/10'
            : 'border-stone-700 dark:border-stone-600 rounded-[38px] shadow-stone-900/30'
        }`}
      >
        {/* Hardware Status Bar */}
        <div className="relative z-30 shrink-0 h-10 px-6 flex items-center justify-between text-[11px] font-semibold text-stone-900 dark:text-white bg-transparent pointer-events-none select-none">
          {/* Clock */}
          <span>9:41</span>

          {/* Dynamic Island / Camera Punch Hole */}
          {isIos ? (
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-6 w-28 bg-black rounded-full flex items-center justify-end pr-2 gap-1.5 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-stone-800 shadow-inner" />
          )}

          {/* Telemetry Icons */}
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-hidden bg-stone-50 dark:bg-stone-900">
          {children}
        </div>

        {/* Bottom Home Indicator Bar (iOS) */}
        {isIos && (
          <div className="shrink-0 h-4 bg-transparent flex items-center justify-center pointer-events-none">
            <div className="w-32 h-1 bg-stone-400 dark:bg-stone-500 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
