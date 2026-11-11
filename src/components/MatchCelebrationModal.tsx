import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Send, Sparkles, X } from 'lucide-react';
import { LoverProfile } from '../types';

interface MatchCelebrationModalProps {
  matchedProfile: LoverProfile | null;
  currentUserAvatar: string;
  onClose: () => void;
  onOpenChat: (profile: LoverProfile, icebreakerText?: string) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  matchedProfile,
  currentUserAvatar,
  onClose,
  onOpenChat,
}) => {
  useEffect(() => {
    if (matchedProfile) {
      // Trigger festive confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#fb7185', '#f59e0b', '#38bdf8'],
        });
      } catch (err) {
        // Safe fallback if canvas is not initialized
      }
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  const icebreakers = [
    `Hey ${matchedProfile.name}! Saw your passion for ${matchedProfile.passions[0] || 'music'}—let's compare notes! 🎺`,
    `Your first date idea sounds perfect! Cardamom coffee on me? ☕`,
    `A rhythm duet: you on ${matchedProfile.marchingLoveInterest ? 'lead' : 'melody'} and me on cadence? 🥁`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-stone-800 text-white p-6 shadow-2xl relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Title */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rhythm & Romance</span>
        </div>

        <h2 className="font-serif-romance text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-400 via-rose-200 to-amber-200 bg-clip-text text-transparent mb-1">
          It's a Match!
        </h2>
        <p className="text-xs text-stone-300 mb-6">
          You and {matchedProfile.name} liked each other!
        </p>

        {/* Dual Avatars with Connected Heart */}
        <div className="relative flex items-center justify-center mb-6">
          {/* User's photo */}
          <div className="w-20 h-20 rounded-full border-4 border-rose-500 overflow-hidden shadow-lg -mr-3 z-10 bg-stone-800">
            <img
              src={currentUserAvatar}
              alt="You"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Connected Beating Heart */}
          <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-stone-900 flex items-center justify-center text-white z-20 shadow-md shadow-rose-600/40 animate-pulse">
            <Heart className="w-5 h-5 fill-white stroke-none" />
          </div>

          {/* Matched lover's photo */}
          <div className="w-20 h-20 rounded-full border-4 border-amber-400 overflow-hidden shadow-lg -ml-3 z-10 bg-stone-800">
            <img
              src={matchedProfile.photos[0]}
              alt={matchedProfile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Chemistry Note */}
        <div className="w-full p-3 rounded-2xl bg-stone-800/60 border border-stone-700/60 mb-5 text-left text-xs text-stone-300">
          <div className="font-semibold text-white mb-0.5">
            {matchedProfile.matchScore}% Chemistry Compatibility
          </div>
          <p className="text-stone-400 text-[11px] line-clamp-2">
            Shared passions: {matchedProfile.passions.slice(0, 3).join(', ')}
          </p>
        </div>

        {/* Quick Icebreakers */}
        <div className="w-full space-y-2 mb-5">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold text-left">
            Send an instant icebreaker:
          </div>
          {icebreakers.map((icebreaker, i) => (
            <button
              key={i}
              onClick={() => onOpenChat(matchedProfile, icebreaker)}
              className="w-full p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 border border-stone-700 text-stone-200 text-xs text-left transition-colors flex items-center justify-between group"
            >
              <span className="line-clamp-1">{icebreaker}</span>
              <Send className="w-3.5 h-3.5 text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="w-full space-y-2">
          <button
            onClick={() => onOpenChat(matchedProfile)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
          >
            <span>Open Conversation</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            Keep Exploring Lovers
          </button>
        </div>
      </div>
    </div>
  );
};
