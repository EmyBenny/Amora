import React from 'react';
import { X, Sparkles, Music, MapPin, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { LoverProfile } from '../types';
import { calculateCompatibility } from '../services/matchingAlgorithm';

interface AlgorithmExplainerModalProps {
  profile: LoverProfile | null;
  onClose: () => void;
  user: {
    age: number;
    passions: string[];
    marchingLoveInterest?: string;
    loveLanguage: string;
    preferences: any;
  };
}

export const AlgorithmExplainerModal: React.FC<AlgorithmExplainerModalProps> = ({
  profile,
  onClose,
  user,
}) => {
  if (!profile) return null;

  const breakdown = calculateCompatibility(user, profile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="font-serif-romance text-lg font-bold text-stone-900 dark:text-white">
                Match Chemistry Engine
              </h2>
              <p className="text-xs text-stone-500">Compatibility with {profile.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Hero */}
        <div className="p-5 bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-950/20 text-center border-b border-stone-100 dark:border-stone-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-sm shadow-xs mb-2">
            <Sparkles className="w-4 h-4" />
            <span>{breakdown.totalScore}% Chemistry Compatibility</span>
          </div>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Calculated via our Flutter multi-factor recommendation algorithm considering preferences, shared passions, and musical harmony.
          </p>
        </div>

        {/* Factors Breakdown */}
        <div className="p-5 space-y-3.5 overflow-y-auto max-h-[50vh]">
          {/* Shared Passions */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Shared Passions Overlap</span>
              </div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                +{breakdown.passionScore} / 40 pts
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              {breakdown.sharedPassions.length > 0
                ? `Shared interests: ${breakdown.sharedPassions.join(', ')}`
                : 'Diverse hobbies create complementary conversational spark.'}
            </p>
          </div>

          {/* Marching & Music Harmony */}
          <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
                <Music className="w-4 h-4 text-amber-500" />
                <span>Marching & Rhythm Harmony</span>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                +{breakdown.marchingBonus} / 20 pts
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300">
              High alignment on brass fanfare, cadence, and live marching performance energy.
            </p>
          </div>

          {/* Distance Proximity */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Geographic Proximity</span>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +{breakdown.distanceScore} / 15 pts
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Located {profile.distanceKm.toFixed(1)} km away within your target local perimeter.
            </p>
          </div>

          {/* Age Affinity */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>Age Affinity</span>
              </div>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                +{breakdown.ageScore} / 15 pts
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Age {profile.age} is within your preferred {user.preferences.ageRange[0]}–{user.preferences.ageRange[1]} dating bracket.
            </p>
          </div>

          {/* Love Language */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>Love Language Alignment</span>
              </div>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                +{breakdown.loveLanguageScore} / 10 pts
              </span>
            </div>
            <p className="text-[11px] text-stone-500 truncate">
              {profile.loveLanguage}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold transition-colors shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
