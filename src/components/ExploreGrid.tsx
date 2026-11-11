import React, { useState } from 'react';
import { Sparkles, Heart, CheckCircle2, Music, Coffee, Compass, BookOpen } from 'lucide-react';
import { LoverProfile } from '../types';

interface ExploreGridProps {
  profiles: LoverProfile[];
  onSelectProfile: (profile: LoverProfile) => void;
  onLikeProfile: (profile: LoverProfile) => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({
  profiles,
  onSelectProfile,
  onLikeProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Lovers', icon: Sparkles },
    { id: 'marching', label: 'Marching & Music', icon: Music },
    { id: 'coffee', label: 'Coffee & Books', icon: Coffee },
    { id: 'outdoors', label: 'Outdoors & Travel', icon: Compass },
    { id: 'creative', label: 'Creative & Arts', icon: BookOpen },
  ];

  const filteredProfiles = profiles.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'marching') {
      return (
        p.passions.some((pass) => pass.toLowerCase().includes('marching') || pass.toLowerCase().includes('brass') || pass.toLowerCase().includes('percussion')) ||
        Boolean(p.marchingLoveInterest)
      );
    }
    if (selectedCategory === 'coffee') {
      return p.passions.some((pass) => pass.toLowerCase().includes('coffee') || pass.toLowerCase().includes('vinyl'));
    }
    if (selectedCategory === 'outdoors') {
      return p.passions.some((pass) => pass.toLowerCase().includes('trail') || pass.toLowerCase().includes('running') || pass.toLowerCase().includes('camping'));
    }
    if (selectedCategory === 'creative') {
      return p.passions.some((pass) => pass.toLowerCase().includes('design') || pass.toLowerCase().includes('film') || pass.toLowerCase().includes('pottery') || pass.toLowerCase().includes('ceramics'));
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-50 dark:bg-stone-900 overflow-y-auto">
      {/* Category Filter Tabs */}
      <div className="p-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0">
        <h2 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-2">
          Curated Match Collections
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="p-4 grid grid-cols-2 gap-3.5">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => onSelectProfile(profile)}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md bg-stone-900 cursor-pointer border border-stone-200 dark:border-stone-800 aspect-[3/4] flex flex-col justify-end"
          >
            {/* Background image */}
            <img
              src={profile.photos[0]}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />

            {/* Top Match Score Pill */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
              {profile.matchScore}%
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-3 text-white">
              <div className="flex items-center gap-1">
                <span className="font-serif-romance text-base font-bold truncate">
                  {profile.name}, {profile.age}
                </span>
                {profile.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                )}
              </div>

              <div className="text-[11px] text-stone-300 truncate">
                {profile.occupation}
              </div>

              {profile.marchingLoveInterest && (
                <div className="flex items-center gap-1 text-[10px] text-amber-300 mt-1 truncate">
                  <Music className="w-3 h-3 shrink-0" />
                  <span className="truncate">Marching lover</span>
                </div>
              )}

              {/* Quick Like Overlay on hover/tap */}
              <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">
                  {profile.distanceKm.toFixed(1)} km
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeProfile(profile);
                  }}
                  className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                  title="Like profile"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
