import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import {
  Heart,
  X,
  Star,
  RotateCcw,
  Info,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Music,
} from 'lucide-react';
import { LoverProfile } from '../types';

interface SwipeCardDeckProps {
  profiles: LoverProfile[];
  onSwipe: (profile: LoverProfile, direction: 'left' | 'right' | 'super') => void;
  onRewind: () => void;
  canRewind: boolean;
  onOpenProfile: (profile: LoverProfile) => void;
  onResetDeck: () => void;
  onOpenFilter: () => void;
  onOpenAlgorithm?: (profile: LoverProfile) => void;
}

export const SwipeCardDeck: React.FC<SwipeCardDeckProps> = ({
  profiles,
  onSwipe,
  onRewind,
  canRewind,
  onOpenProfile,
  onResetDeck,
  onOpenFilter,
  onOpenAlgorithm,
}) => {
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Active top profile
  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  // Motion drag values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [15, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-15, -100], [0, 1]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.98, 1, 0.98]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (info.offset.x > 100) {
      handleLike();
    } else if (info.offset.x < -100) {
      handleDislike();
    } else if (info.offset.y < -120) {
      handleSuperLike();
    }
  };

  const handleLike = () => {
    if (!currentProfile) return;
    setPhotoIndex(0);
    setIsPlayingAudio(false);
    onSwipe(currentProfile, 'right');
  };

  const handleDislike = () => {
    if (!currentProfile) return;
    setPhotoIndex(0);
    setIsPlayingAudio(false);
    onSwipe(currentProfile, 'left');
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;
    setPhotoIndex(0);
    setIsPlayingAudio(false);
    onSwipe(currentProfile, 'super');
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProfile) return;
    if (photoIndex < currentProfile.photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    } else {
      setPhotoIndex(0);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProfile) return;
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    } else {
      setPhotoIndex(currentProfile.photos.length - 1);
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h3 className="font-serif-romance text-2xl font-bold text-stone-900 dark:text-white mb-2">
          You've explored everyone nearby
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xs mb-6">
          Adjust your gender, distance, or passion filters to discover more matching lovers and marching band enthusiasts.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={onResetDeck}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors shadow-sm"
          >
            Review Profiles Again
          </button>
          <button
            onClick={onOpenFilter}
            className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-sm transition-colors"
          >
            Edit Filters
          </button>
        </div>
      </div>
    );
  }

  const currentPhoto = currentProfile.photos[photoIndex] || currentProfile.photos[0];

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      {/* Card Viewport Container */}
      <div className="relative flex-1 w-full max-h-[580px] flex items-center justify-center">
        {/* Background Card Preview (Stack effect) */}
        {nextProfile && (
          <div className="absolute inset-0 top-3 rounded-3xl overflow-hidden shadow-md border border-stone-200 dark:border-stone-800 bg-stone-900 scale-95 opacity-80 pointer-events-none">
            <img
              src={nextProfile.photos[0]}
              alt={nextProfile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xl font-bold font-serif-romance">
                {nextProfile.name}, {nextProfile.age}
              </span>
            </div>
          </div>
        )}

        {/* Foreground Swiping Card */}
        <motion.div
          style={{ x, rotate, scale: cardScale }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-700 bg-stone-900 cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Main Photo with Safe Fallback */}
          <img
            src={currentPhoto}
            alt={currentProfile.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Left/Right Tap Zones for photo switching */}
          <div className="absolute inset-0 flex z-10">
            <button
              onClick={prevPhoto}
              className="w-1/3 h-full cursor-pointer focus:outline-none"
              aria-label="Previous photo"
            />
            <button
              onClick={() => onOpenProfile(currentProfile)}
              className="w-1/3 h-full cursor-pointer focus:outline-none"
              aria-label="Open profile info"
            />
            <button
              onClick={nextPhoto}
              className="w-1/3 h-full cursor-pointer focus:outline-none"
              aria-label="Next photo"
            />
          </div>

          {/* Top Photo Indicator Bars */}
          <div className="absolute top-3 left-4 right-4 z-20 flex gap-1.5 pointer-events-none">
            {currentProfile.photos.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx === photoIndex
                    ? 'bg-white shadow-xs'
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Dynamic Like Stamp (Green) */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-6 z-20 border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl uppercase tracking-widest px-4 py-1 rounded-xl rotate-[-16deg] bg-emerald-950/40 backdrop-blur-xs pointer-events-none"
          >
            LIKE
          </motion.div>

          {/* Dynamic Nope Stamp (Red) */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-6 z-20 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl uppercase tracking-widest px-4 py-1 rounded-xl rotate-[16deg] bg-rose-950/40 backdrop-blur-xs pointer-events-none"
          >
            PASS
          </motion.div>

          {/* Gradient Scrim for WCAG readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent pointer-events-none" />

          {/* Card Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white flex flex-col gap-2">
            {/* Top row: Name, Age, Verified, Compatibility badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif-romance text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                {currentProfile.verified && (
                  <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20 shrink-0" />
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenAlgorithm) onOpenAlgorithm(currentProfile);
                }}
                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/90 hover:bg-rose-500 active:scale-95 transition-all backdrop-blur-sm text-white text-xs font-bold shadow-sm cursor-pointer z-30"
                title="View Match Chemistry breakdown"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentProfile.matchScore}% Match</span>
              </button>
            </div>

            {/* Occupation, Distance, Zodiac */}
            <div className="flex items-center gap-2 text-xs text-stone-200">
              <span>{currentProfile.occupation}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-rose-400" />
                {currentProfile.distanceKm.toFixed(1)} km away
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentProfile.zodiac}</span>
            </div>

            {/* Marching & Musical Connection Banner */}
            {currentProfile.marchingLoveInterest && (
              <div className="mt-1 flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs">
                <Music className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="line-clamp-2 leading-relaxed font-medium">
                  {currentProfile.marchingLoveInterest}
                </p>
              </div>
            )}

            {/* Voice Prompt snippet */}
            {currentProfile.voicePrompt && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlayingAudio(!isPlayingAudio);
                }}
                className="mt-1 flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isPlayingAudio ? (
                    <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-300" />
                  )}
                  <span className="truncate max-w-[200px]">
                    {currentProfile.voicePrompt.title}
                  </span>
                </div>

                {/* Animated wave bars */}
                <div className="flex items-center gap-0.5 h-3">
                  {[40, 75, 50, 90, 60, 30].map((height, i) => (
                    <div
                      key={i}
                      className={`w-0.5 bg-rose-400 rounded-full transition-all duration-200 ${
                        isPlayingAudio ? 'animate-pulse' : 'opacity-60'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                  <span className="ml-1 text-[11px] tabular-nums text-stone-300">
                    0:{currentProfile.voicePrompt.durationSeconds}
                  </span>
                </div>
              </button>
            )}

            {/* Quick Prompts preview + info trigger */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-stone-300 line-clamp-1 italic">
                "{currentProfile.prompts[0]?.answer}"
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfile(currentProfile);
                }}
                className="shrink-0 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="View full profile"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons Bar (Flutter / Material 3 floating controls) */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 pt-3 pb-1">
        {/* Rewind */}
        <button
          onClick={onRewind}
          disabled={!canRewind}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
            canRewind
              ? 'border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:scale-105 active:scale-95 bg-white dark:bg-stone-800 shadow-sm'
              : 'border-stone-200 dark:border-stone-800 text-stone-300 dark:text-stone-700 cursor-not-allowed bg-stone-100 dark:bg-stone-900'
          }`}
          title="Rewind last swipe"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Dislike / Pass */}
        <button
          onClick={handleDislike}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-stone-800 text-rose-500 border border-stone-200 dark:border-stone-700 shadow-md hover:scale-105 active:scale-95 transition-all"
          title="Pass profile"
          aria-label="Pass profile"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Super Like */}
        <button
          onClick={handleSuperLike}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-stone-800 text-sky-500 border border-stone-200 dark:border-stone-700 shadow-md hover:scale-105 active:scale-95 transition-all"
          title="Super Like"
          aria-label="Super Like"
        >
          <Star className="w-6 h-6 fill-sky-500 stroke-none" />
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all"
          title="Like profile"
          aria-label="Like profile"
        >
          <Heart className="w-7 h-7 fill-white stroke-none" />
        </button>

        {/* Open Details */}
        <button
          onClick={() => onOpenProfile(currentProfile)}
          className="w-11 h-11 rounded-full flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:scale-105 active:scale-95 bg-white dark:bg-stone-800 shadow-sm transition-all"
          title="Inspect full profile details"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
