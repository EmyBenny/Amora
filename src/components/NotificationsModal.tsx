import React, { useState } from 'react';
import {
  X,
  Bell,
  Heart,
  MessageCircle,
  Star,
  Calendar,
  Music,
  Sparkles,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { AppNotification, NotificationSettings } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onSelectNotification: (notification: AppNotification) => void;
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onSelectNotification,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'matches' | 'messages' | 'events'>('all');
  const [showSettings, setShowSettings] = useState(false);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'matches') return n.type === 'new_match' || n.type === 'super_like' || n.type === 'chemistry_alert';
    if (activeTab === 'messages') return n.type === 'message' || n.type === 'date_invite';
    if (activeTab === 'events') return n.type === 'marching_event';
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'new_match':
        return <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />;
      case 'super_like':
        return <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />;
      case 'message':
        return <MessageCircle className="w-3.5 h-3.5 text-sky-500" />;
      case 'date_invite':
        return <Calendar className="w-3.5 h-3.5 text-purple-500" />;
      case 'marching_event':
        return <Music className="w-3.5 h-3.5 text-amber-500" />;
      case 'chemistry_alert':
        return <Sparkles className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-stone-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <Bell className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-romance text-lg font-bold text-stone-900 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">Matches, messages & marching alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
              }`}
              title="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Drawer Panel */}
        {showSettings && (
          <div className="p-4 bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 text-xs space-y-3 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between font-bold text-stone-700 dark:text-stone-300">
              <span>Notification Preferences (Flutter Push & Local)</span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-[11px] text-rose-600 font-semibold"
              >
                Done
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-stone-700 dark:text-stone-300">New Match Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.matchAlerts}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, matchAlerts: e.target.checked })
                  }
                  className="accent-rose-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-stone-700 dark:text-stone-300">Direct Message Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.messageAlerts}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, messageAlerts: e.target.checked })
                  }
                  className="accent-rose-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-stone-700 dark:text-stone-300">Marching & Rhythm Events</span>
                <input
                  type="checkbox"
                  checked={settings.marchingAlerts}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, marchingAlerts: e.target.checked })
                  }
                  className="accent-rose-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-stone-700 dark:text-stone-300">Chime Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, soundEnabled: e.target.checked })
                  }
                  className="accent-rose-600 rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* Filter Tabs & Mark All as Read */}
        <div className="p-3 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex gap-1 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'matches', label: 'Matches' },
              { id: 'messages', label: 'Messages' },
              { id: 'events', label: 'Events' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-rose-600 text-white'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-2">
                <Bell className="w-6 h-6 stroke-1" />
              </div>
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                No notifications in this category
              </p>
              <p className="text-[11px] text-stone-400 max-w-xs mt-0.5">
                When lovers like your profile or send you a message, alerts will appear here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) onMarkAsRead(notif.id);
                  onSelectNotification(notif);
                }}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer group ${
                  notif.read
                    ? 'bg-white dark:bg-stone-850 border-stone-100 dark:border-stone-800/80 opacity-80'
                    : 'bg-rose-50/50 dark:bg-stone-800 border-rose-200/80 dark:border-rose-900/60 shadow-xs'
                }`}
              >
                {/* Avatar with Type Badge */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-700 border border-stone-200 dark:border-stone-700">
                    {notif.senderAvatar ? (
                      <img
                        src={notif.senderAvatar}
                        alt={notif.senderName || 'Avatar'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500">
                        <Bell className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                    {getIcon(notif.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {notif.body}
                  </p>
                </div>

                {/* Unread dot or Delete Action */}
                <div className="flex items-center gap-1 shrink-0 self-center">
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNotification(notif.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
          <span>Synced with Flutter Local Notifications</span>
          <button
            onClick={onClose}
            className="font-semibold text-rose-600 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
