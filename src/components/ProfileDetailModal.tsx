import React, { useState } from 'react';
import {
  X,
  Heart,
  CheckCircle2,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Music,
  Ruler,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { LoverProfile } from '../types';

interface ProfileDetailModalProps {
  profile: LoverProfile | null;
  onClose: () => void;
  onLike: (profile: LoverProfile) => void;
  onPass: (profile: LoverProfile) => void;
  onStartChat?: (profile: LoverProfile) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onLike,
  onPass,
  onStartChat,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Container */}
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 animate-in slide-in-from-bottom-8 duration-200">
        {/* Top Drag bar for mobile bottom sheet */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Scrollable Profile Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Photo Carousel */}
          <div className="relative aspect-[3/4] w-full bg-stone-900">
            <img
              src={profile.photos[activePhotoIdx] || profile.photos[0]}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Photo Indicator tabs */}
            <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-10">
              {profile.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i === activePhotoIdx ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />

            {/* Hero details */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-romance text-3xl font-bold">
                    {profile.name}, {profile.age}
                  </h1>
                  {profile.verified && (
                    <CheckCircle2 className="w-6 h-6 text-sky-400 fill-sky-400/20" />
                  )}
                </div>
                <div className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{profile.matchScore}% Match</span>
                </div>
              </div>
              <p className="text-sm text-stone-200 mt-1 font-medium">{profile.headline}</p>
            </div>
          </div>

          {/* Content sections */}
          <div className="p-6 space-y-6">
            {/* Marching & Music Highlight */}
            {profile.marchingLoveInterest && (
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
                  <Music className="w-4 h-4" />
                  <span>Marching & Rhythm Passion</span>
                </div>
                <p className="text-stone-800 dark:text-stone-200 text-sm leading-relaxed">
                  {profile.marchingLoveInterest}
                </p>
              </div>
            )}

            {/* About Me Bio */}
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-2">
                About Me
              </h2>
              <p className="text-stone-800 dark:text-stone-200 text-sm leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-stone-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] text-stone-400">Work</div>
                  <div className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                    {profile.occupation}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-stone-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] text-stone-400">Education</div>
                  <div className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                    {profile.education}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-stone-400">Distance</div>
                  <div className="text-xs font-medium text-stone-900 dark:text-stone-100">
                    {profile.distanceKm.toFixed(1)} km away
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3">
                <Ruler className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-stone-400">Height</div>
                  <div className="text-xs font-medium text-stone-900 dark:text-stone-100">
                    {profile.heightCm} cm
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3">
                <Compass className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-stone-400">Zodiac</div>
                  <div className="text-xs font-medium text-stone-900 dark:text-stone-100">
                    {profile.zodiac}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center gap-3">
                <Heart className="w-4 h-4 text-stone-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] text-stone-400">Love Language</div>
                  <div className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                    {profile.loveLanguage}
                  </div>
                </div>
              </div>
            </div>

            {/* Passions list */}
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-2.5">
                Passions & Interests
              </h2>
              <div className="flex flex-wrap gap-2 text-xs text-stone-700 dark:text-stone-300">
                {profile.passions.map((passion, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium"
                  >
                    {passion}
                  </span>
                ))}
              </div>
            </div>

            {/* Dating Prompts */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs uppercase tracking-wider font-bold text-stone-400">
                Prompts & Perspectives
              </h2>
              {profile.prompts.map((prompt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1.5"
                >
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {prompt.question}
                  </p>
                  <p className="font-serif-romance text-base text-stone-900 dark:text-stone-100 leading-snug">
                    {prompt.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onPass(profile);
              onClose();
            }}
            className="flex-1 h-12 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5 text-rose-500" />
            <span>Pass</span>
          </button>

          {onStartChat ? (
            <button
              onClick={() => {
                onStartChat(profile);
                onClose();
              }}
              className="flex-1 h-12 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Note</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onLike(profile);
                onClose();
              }}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Like {profile.name}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
