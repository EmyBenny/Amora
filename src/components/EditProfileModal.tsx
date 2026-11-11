import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Camera,
  Check,
  Music,
  Heart,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { FilterSettings } from '../types';

export interface EditableUserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  headline: string;
  bio: string;
  photos: string[];
  passions: string[];
  marchingLoveInterest?: string;
  occupation: string;
  education: string;
  heightCm: number;
  loveLanguage: string;
  zodiac: string;
  preferences: FilterSettings;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: EditableUserProfile;
  onSave: (updatedUser: EditableUserProfile) => void;
}

const ALL_AVAILABLE_PASSIONS = [
  'Marching & Brass',
  'Drumline & Percussion',
  'Coffee Crawls',
  'Vinyl Records',
  'Jazz Fusion',
  '35mm Film',
  'Trail Running',
  'Italian Cooking',
  'Pottery & Ceramics',
  'Acoustic Jamming',
  'Bouldering',
  'Landscape Design',
  'Indie Folk',
  'Street Festivals',
];

const PRESET_SAMPLE_PHOTOS = [
  { label: 'Golden Hour Plaza', url: '/src/assets/images/profile_alex_male_1794407597086.jpg' },
  { label: 'Botanical Cafe', url: '/src/assets/images/profile_sophia_female_1794407594119.jpg' },
  { label: 'Urban Terrace', url: '/src/assets/images/profile_marcus_male_1794407594793.jpg' },
  { label: 'Parisian Bistro', url: '/src/assets/images/profile_elena_female_1794407596172.jpg' },
  { label: 'Rooftop Sunset', url: '/src/assets/images/dating_lovers_hero_1794407595304.jpg' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<EditableUserProfile>({ ...user });
  const [activeTab, setActiveTab] = useState<'details' | 'passions' | 'preferences'>('details');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  if (!isOpen) return null;

  const handleTogglePassion = (passion: string) => {
    const exists = formData.passions.includes(passion);
    const updated = exists
      ? formData.passions.filter((p) => p !== passion)
      : [...formData.passions, passion];
    setFormData({ ...formData, passions: updated });
  };

  const handleRemovePhoto = (index: number) => {
    if (formData.photos.length <= 1) {
      alert('You must have at least one profile photo.');
      return;
    }
    const updated = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: updated });
  };

  const handleAddPresetPhoto = (url: string) => {
    if (formData.photos.includes(url)) return;
    setFormData({ ...formData, photos: [...formData.photos, url] });
    setShowPhotoPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif-romance text-xl font-bold text-stone-900 dark:text-white">
              Edit Dating Profile
            </h2>
            <p className="text-xs text-stone-500">
              Update photos, bio, marching passions & match settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pt-3 pb-1 border-b border-stone-100 dark:border-stone-800 shrink-0">
          <div className="grid grid-cols-3 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 rounded-lg transition-colors ${
                activeTab === 'details'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-300'
              }`}
            >
              Bio & Photos
            </button>
            <button
              onClick={() => setActiveTab('passions')}
              className={`py-2 rounded-lg transition-colors ${
                activeTab === 'passions'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-300'
              }`}
            >
              Interests ({formData.passions.length})
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2 rounded-lg transition-colors ${
                activeTab === 'preferences'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-300'
              }`}
            >
              Match Settings
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: BIO & PHOTOS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Photo Management Grid */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-400 mb-2">
                  Profile Photos ({formData.photos.length})
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {formData.photos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-800 group"
                    >
                      <img
                        src={photoUrl}
                        alt={`Photo ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                          Cover
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white opacity-80 group-hover:opacity-100 transition-all"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Photo Slot */}
                  {formData.photos.length < 5 && (
                    <button
                      type="button"
                      onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                      className="aspect-[3/4] rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-rose-500 dark:hover:border-rose-400 flex flex-col items-center justify-center gap-1.5 text-stone-400 hover:text-rose-500 transition-colors bg-stone-50/50 dark:bg-stone-800/30"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-[11px] font-semibold">Add Photo</span>
                    </button>
                  )}
                </div>

                {/* Preset Photo Selector Picker Drawer */}
                {showPhotoPicker && (
                  <div className="mt-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
                      Choose from high-res portrait library:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_SAMPLE_PHOTOS.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddPresetPhoto(item.url)}
                          className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-rose-500 bg-white dark:bg-stone-800 text-left text-xs font-medium text-stone-700 dark:text-stone-200"
                        >
                          <img
                            src={item.url}
                            alt={item.label}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Name and Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                  Profile Headline
                </label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Architect of warm spaces & lover of brass harmonies"
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              {/* About Me Bio */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                  About Me Bio
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white leading-relaxed resize-none"
                />
              </div>

              {/* Marching & Musical Connection */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-amber-500 mb-1 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  <span>Marching & Rhythm Passion</span>
                </label>
                <input
                  type="text"
                  value={formData.marchingLoveInterest || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, marchingLoveInterest: e.target.value })
                  }
                  placeholder="e.g. Lead snare drummer in alumni marching ensemble"
                  className="w-full p-2.5 text-xs rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 text-stone-900 dark:text-white"
                />
              </div>

              {/* Work & Education */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASSIONS & INTERESTS */}
          {activeTab === 'passions' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif-romance text-base font-bold text-stone-900 dark:text-white mb-1">
                  Select Your Passions & Lifestyle
                </h3>
                <p className="text-xs text-stone-500 mb-3">
                  Our Flutter matching algorithm uses shared passions to calculate compatibility chemistry with candidate lovers.
                </p>

                <div className="flex flex-wrap gap-2">
                  {ALL_AVAILABLE_PASSIONS.map((passion) => {
                    const isSelected = formData.passions.includes(passion);
                    return (
                      <button
                        key={passion}
                        type="button"
                        onClick={() => handleTogglePassion(passion)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{passion}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Love Language */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                  Primary Love Language
                </label>
                <select
                  value={formData.loveLanguage}
                  onChange={(e) =>
                    setFormData({ ...formData, loveLanguage: e.target.value })
                  }
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="Quality Time & Words of Affirmation">Quality Time & Words of Affirmation</option>
                  <option value="Acts of Service & Physical Touch">Acts of Service & Physical Touch</option>
                  <option value="Physical Touch & Quality Time">Physical Touch & Quality Time</option>
                  <option value="Receiving Handcrafted Gifts & Affirmation">Receiving Handcrafted Gifts & Affirmation</option>
                  <option value="Deep Conversations & Shared Music">Deep Conversations & Shared Music</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: DATING PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-400 mb-2">
                  Interested In Dating
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Everyone' },
                    { id: 'female', label: 'Women' },
                    { id: 'male', label: 'Men' },
                  ].map((item) => {
                    const isSelected = formData.preferences.genderPreference === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              genderPreference: item.id as 'all' | 'female' | 'male',
                            },
                          })
                        }
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Maximum Distance */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                    Max Distance
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    {formData.preferences.maxDistanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={50}
                  value={formData.preferences.maxDistanceKm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        maxDistanceKm: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Age Range */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                    Age Preference
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    {formData.preferences.ageRange[0]} – {formData.preferences.ageRange[1]} years
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-stone-400 block mb-1">Min Age</span>
                    <input
                      type="number"
                      min={18}
                      max={formData.preferences.ageRange[1] - 1}
                      value={formData.preferences.ageRange[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            ageRange: [Number(e.target.value), formData.preferences.ageRange[1]],
                          },
                        })
                      }
                      className="w-full p-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 block mb-1">Max Age</span>
                    <input
                      type="number"
                      min={formData.preferences.ageRange[0] + 1}
                      max={70}
                      value={formData.preferences.ageRange[1]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            ageRange: [formData.preferences.ageRange[0], Number(e.target.value)],
                          },
                        })
                      }
                      className="w-full p-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-semibold transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Update Matching</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
