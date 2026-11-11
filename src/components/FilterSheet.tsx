import React from 'react';
import { X, Check } from 'lucide-react';
import { FilterSettings } from '../types';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterSettings;
  onUpdateFilters: (newFilters: FilterSettings) => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
}) => {
  if (!isOpen) return null;

  const handleGenderSelect = (gender: 'all' | 'female' | 'male') => {
    onUpdateFilters({
      ...filters,
      genderPreference: gender,
    });
  };

  const passionOptions = [
    'All Passions',
    'Marching & Brass',
    'Drumline & Percussion',
    'Coffee Crawls',
    'Vinyl Records',
    'Acoustic Jamming',
    'Trail Running',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif-romance text-xl font-bold text-stone-900 dark:text-white">
              Dating Preferences
            </h3>
            <p className="text-xs text-stone-500">Fine-tune matching lovers & chemistry</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Gender Preference */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-400 mb-2">
              Interested in Meeting
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Everyone' },
                { id: 'female', label: 'Women' },
                { id: 'male', label: 'Men' },
              ].map((item) => {
                const isSelected = filters.genderPreference === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleGenderSelect(item.id as 'all' | 'female' | 'male')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Maximum Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs uppercase tracking-wider font-bold text-stone-400">
                Maximum Distance
              </label>
              <span className="text-xs font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                {filters.maxDistanceKm} km
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={50}
              step={1}
              value={filters.maxDistanceKm}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  maxDistanceKm: Number(e.target.value),
                })
              }
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>2 km (Local)</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Age Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs uppercase tracking-wider font-bold text-stone-400">
                Age Range
              </label>
              <span className="text-xs font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                {filters.ageRange[0]} – {filters.ageRange[1]} years
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Min Age</span>
                <input
                  type="number"
                  min={18}
                  max={filters.ageRange[1] - 1}
                  value={filters.ageRange[0]}
                  onChange={(e) =>
                    onUpdateFilters({
                      ...filters,
                      ageRange: [Math.max(18, Number(e.target.value)), filters.ageRange[1]],
                    })
                  }
                  className="w-full p-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Max Age</span>
                <input
                  type="number"
                  min={filters.ageRange[0] + 1}
                  max={65}
                  value={filters.ageRange[1]}
                  onChange={(e) =>
                    onUpdateFilters({
                      ...filters,
                      ageRange: [filters.ageRange[0], Math.min(65, Number(e.target.value))],
                    })
                  }
                  className="w-full p-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Marching & Passions Filter */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-400 mb-2">
              Marching & Music Passion Filter
            </label>
            <div className="flex flex-wrap gap-1.5">
              {passionOptions.map((opt) => {
                const isSelected =
                  (!filters.passionFilter && opt === 'All Passions') ||
                  filters.passionFilter === opt;
                return (
                  <button
                    key={opt}
                    onClick={() =>
                      onUpdateFilters({
                        ...filters,
                        passionFilter: opt === 'All Passions' ? undefined : opt,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300 font-semibold'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verified Profiles Only Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <div>
              <div className="text-xs font-semibold text-stone-900 dark:text-white">
                Verified Profiles Only
              </div>
              <div className="text-[11px] text-stone-400">
                Only show lovers with selfie verification badge
              </div>
            </div>
            <button
              onClick={() =>
                onUpdateFilters({
                  ...filters,
                  onlyVerified: !filters.onlyVerified,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                filters.onlyVerified ? 'bg-rose-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex gap-3">
          <button
            onClick={() =>
              onUpdateFilters({
                genderPreference: 'all',
                ageRange: [20, 35],
                maxDistanceKm: 25,
                onlyVerified: false,
                passionFilter: undefined,
              })
            }
            className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
