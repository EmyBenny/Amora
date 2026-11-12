import React, { useState } from 'react';
import {
  CheckCircle2,
  Camera,
  Edit3,
  Settings,
  Bell,
  Eye,
  Sliders,
  Music,
  Heart,
  Users,
  LogIn,
  LogOut,
  Sparkles,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { EditableUserProfile } from './EditProfileModal';

interface UserProfileViewProps {
  user: EditableUserProfile;
  onOpenEditProfile: () => void;
  onOpenFilter: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  currentPersona: 'male' | 'female';
  onTogglePersona: () => void;
  loggedInUser: { name: string; email: string; avatar?: string } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenAlgorithm: () => void;
  onViewFlutterCode?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onOpenEditProfile,
  onOpenFilter,
  isDarkMode,
  setIsDarkMode,
  currentPersona,
  onTogglePersona,
  loggedInUser,
  onOpenAuth,
  onSignOut,
  onOpenAlgorithm,
  onViewFlutterCode,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [incognito, setIncognito] = useState(false);

  const displayAvatar = loggedInUser?.avatar || user.photos[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-50 dark:bg-stone-900 overflow-y-auto">
      {/* Profile Header Avatar */}
      <div className="p-6 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex flex-col items-center text-center shrink-0">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-rose-500 shadow-lg bg-stone-800">
            <img
              src={displayAvatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={onOpenEditProfile}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-md border-2 border-white dark:border-stone-900 transition-colors"
            title="Edit profile & photos"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-0.5">
          <h2 className="font-serif-romance text-2xl font-bold text-stone-900 dark:text-white">
            {user.name}, {user.age}
          </h2>
          <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500/20" />
        </div>

        <p className="text-xs text-stone-500 max-w-xs">{user.headline}</p>

        {/* Authentication Badge */}
        {loggedInUser ? (
          <div className="mt-2.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Securely authenticated ({loggedInUser.email})</span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="mt-2.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-[11px] font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Connect Social Account</span>
          </button>
        )}

        {/* Action Bar (Edit Profile & Switch Persona) */}
        <div className="mt-4 flex items-center gap-2 w-full max-w-xs">
          <button
            onClick={onOpenEditProfile}
            className="flex-1 py-2 px-3 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={onTogglePersona}
            className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5"
            title="Switch demo lover persona"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch to {currentPersona === 'male' ? 'Female' : 'Male'}</span>
          </button>
        </div>
      </div>

      {/* Profile Details & Preferences List */}
      <div className="p-4 space-y-4">
        {/* Marching & Rhythm Interest Card */}
        {user.marchingLoveInterest && (
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Music className="w-4 h-4" />
              <span>My Marching & Music Heartbeat</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300">
              {user.marchingLoveInterest}
            </p>
          </div>
        )}

        {/* Matching Algorithm Chemistry Trigger */}
        <button
          onClick={onOpenAlgorithm}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-600/10 via-amber-500/10 to-rose-600/10 border border-rose-300/40 dark:border-rose-800/40 text-left hover:border-rose-400 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors">
                Matching Algorithm Engine
              </div>
              <div className="text-[11px] text-stone-500">
                Inspect how compatibility chemistry is calculated
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600">View Formula</span>
        </button>

        {/* Passions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              My Passions ({user.passions.length})
            </span>
            <button
              onClick={onOpenEditProfile}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user.passions.map((p, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Dating Preferences Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Dating Preferences
            </span>
            <button
              onClick={onOpenFilter}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Modify</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
              <div className="text-[10px] text-stone-400 uppercase">Looking for</div>
              <div className="font-semibold text-stone-800 dark:text-stone-200 capitalize">
                {user.preferences.genderPreference}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
              <div className="text-[10px] text-stone-400 uppercase">Age Range</div>
              <div className="font-semibold text-stone-800 dark:text-stone-200">
                {user.preferences.ageRange[0]}–{user.preferences.ageRange[1]}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
              <div className="text-[10px] text-stone-400 uppercase">Max Dist</div>
              <div className="font-semibold text-stone-800 dark:text-stone-200">
                {user.preferences.maxDistanceKm} km
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
          {/* Dark / Light Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-stone-400" />
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-white">
                  Dark Mode
                </div>
                <div className="text-[11px] text-stone-400">
                  Comfortable late-night visual styling
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                isDarkMode ? 'bg-rose-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Haptic & Sound Effects */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-stone-400" />
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-white">
                  Match Chimes & Haptics
                </div>
                <div className="text-[11px] text-stone-400">
                  Play gentle chime on mutual like
                </div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                soundEnabled ? 'bg-rose-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Incognito mode */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-stone-400" />
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-white">
                  Incognito Browsing
                </div>
                <div className="text-[11px] text-stone-400">
                  Only appear to lovers you like first
                </div>
              </div>
            </div>
            <button
              onClick={() => setIncognito(!incognito)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                incognito ? 'bg-rose-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Flutter & Dart Source Code Viewer */}
          {onViewFlutterCode && (
            <button
              onClick={onViewFlutterCode}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">
                    Flutter & Dart Architecture Source
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Review Flutter architecture, tests & services
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-rose-600">View Source</span>
            </button>
          )}

          {/* Auth Action Row */}
          {loggedInUser ? (
            <button
              onClick={onSignOut}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-rose-600 dark:text-rose-400"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-semibold">Sign Out ({loggedInUser.email})</span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-stone-800 dark:text-stone-200"
            >
              <div className="flex items-center gap-3">
                <LogIn className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-xs font-semibold">Log In / Sign Up</div>
                  <div className="text-[11px] text-stone-400">Email, Google, or Facebook</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-rose-600">Connect</span>
            </button>
          )}
        </div>

        {/* Community Note */}
        <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/40 text-[11px] text-stone-500 text-center">
          <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
          <span>Amora is built for authentic, respectful romantic connections and musical harmony.</span>
        </div>
      </div>
    </div>
  );
};
