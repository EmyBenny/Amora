import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Compass,
  MessageCircle,
  User,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { DeviceFrame } from './components/DeviceFrame';
import { SwipeCardDeck } from './components/SwipeCardDeck';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { FilterSheet } from './components/FilterSheet';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { ChatView } from './components/ChatView';
import { ExploreGrid } from './components/ExploreGrid';
import { UserProfileView } from './components/UserProfileView';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal, EditableUserProfile } from './components/EditProfileModal';
import { AlgorithmExplainerModal } from './components/AlgorithmExplainerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { INITIAL_PROFILES, INITIAL_MATCHES, CURRENT_USER } from './data/profiles';
import { LoverProfile, FilterSettings, ChatThread, AppNotification, NotificationSettings } from './types';
import { rankProfiles } from './services/matchingAlgorithm';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Layout & Navigation state
  const [activeTab, setActiveTab] = useState<'swipe' | 'explore' | 'matches' | 'profile'>('swipe');
  const [showFlutterCode, setShowFlutterCode] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'pixel'>('mobile');

  // Test Persona: 'male' (Liam) or 'female' (Maya)
  const [currentPersona, setCurrentPersona] = useState<'male' | 'female'>('male');

  // User Profile Data (Editable by user)
  const [currentUserData, setCurrentUserData] = useState<EditableUserProfile>({
    id: CURRENT_USER.id,
    name: CURRENT_USER.name,
    age: CURRENT_USER.age,
    gender: CURRENT_USER.gender,
    headline: CURRENT_USER.headline,
    bio: CURRENT_USER.bio,
    photos: CURRENT_USER.photos,
    passions: CURRENT_USER.passions,
    marchingLoveInterest: CURRENT_USER.marchingLoveInterest,
    occupation: CURRENT_USER.occupation,
    education: CURRENT_USER.education,
    heightCm: CURRENT_USER.heightCm,
    loveLanguage: CURRENT_USER.loveLanguage,
    zodiac: CURRENT_USER.zodiac,
    preferences: {
      genderPreference: 'female',
      ageRange: [21, 35],
      maxDistanceKm: 25,
      onlyVerified: false,
    },
  });

  // Authentication state (supports Email/Password and Google/Facebook)
  const [loggedInUser, setLoggedInUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem('amora_auth_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [explainingProfile, setExplainingProfile] = useState<LoverProfile | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Notification Preferences & In-App notification list
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    matchAlerts: true,
    messageAlerts: true,
    marchingAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      type: 'new_match',
      title: 'It\'s a Match with Sophia! 🎉',
      body: 'You and Sophia liked each other. You both share a 96% rhythm & brass connection.',
      timestamp: '12m ago',
      read: false,
      senderId: 'profile_sophia',
      senderName: 'Sophia',
      senderAvatar: '/src/assets/images/profile_sophia_female_1794407594119.jpg',
      relatedProfileId: 'profile_sophia',
    },
    {
      id: 'notif_2',
      type: 'message',
      title: 'New Message from Sophia',
      body: '"I loved your note about the brass fanfare! When are we checking out that vinyl cafe?"',
      timestamp: '10m ago',
      read: false,
      senderId: 'profile_sophia',
      senderName: 'Sophia',
      senderAvatar: '/src/assets/images/profile_sophia_female_1794407594119.jpg',
      actionRoute: 'chat',
    },
    {
      id: 'notif_3',
      type: 'marching_event',
      title: 'Marching Brass Gathering 🎺',
      body: 'Alumni Marching Ensemble open rehearsal & street cadence jam this Saturday at 4 PM.',
      timestamp: '2h ago',
      read: true,
    },
    {
      id: 'notif_4',
      type: 'super_like',
      title: 'Super Like from Elena ⭐',
      body: 'Elena super-liked your profile and loved your note about tenor drum cadences.',
      timestamp: 'Yesterday',
      read: true,
      senderId: 'profile_elena',
      senderName: 'Elena',
      senderAvatar: '/src/assets/images/profile_elena_female_1794407596172.jpg',
      relatedProfileId: 'profile_elena',
    },
  ]);

  // Profiles stack
  const [profiles, setProfiles] = useState<LoverProfile[]>(INITIAL_PROFILES);
  const [swipedHistory, setSwipedHistory] = useState<LoverProfile[]>([]);

  // Detailed Profile Modal & Celebrations
  const [activeProfileModal, setActiveProfileModal] = useState<LoverProfile | null>(null);
  const [matchedCelebration, setMatchedCelebration] = useState<LoverProfile | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_MATCHES);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Execute Flutter Matching Algorithm to score and rank candidates dynamically
  const rankedProfiles = useMemo(() => {
    const scoredList = rankProfiles(currentUserData, profiles);
    return scoredList
      .filter(({ breakdown, profile }) => {
        // Filter by preferences
        if (currentUserData.preferences.genderPreference !== 'all') {
          if (profile.gender !== currentUserData.preferences.genderPreference) {
            return false;
          }
        }
        if (currentUserData.preferences.onlyVerified && !profile.verified) {
          return false;
        }
        if (currentUserData.preferences.passionFilter) {
          const hasPassion = profile.passions.some((p) =>
            p.toLowerCase().includes(currentUserData.preferences.passionFilter!.toLowerCase())
          );
          if (!hasPassion) return false;
        }
        return breakdown.isHardMatch;
      })
      .map((item) => item.profile);
  }, [currentUserData, profiles]);

  const handleSwipe = (profile: LoverProfile, direction: 'left' | 'right' | 'super') => {
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    setSwipedHistory((prev) => [profile, ...prev]);

    if (direction === 'right' || direction === 'super') {
      setMatchedCelebration(profile);

      if (notificationSettings.matchAlerts) {
        const matchNotif: AppNotification = {
          id: `notif_match_${Date.now()}`,
          type: 'new_match',
          title: `It's a Match with ${profile.name}! 🎉`,
          body: `You and ${profile.name} liked each other! Start a conversation.`,
          timestamp: 'Just now',
          read: false,
          senderId: profile.id,
          senderName: profile.name,
          senderAvatar: profile.photos[0],
          relatedProfileId: profile.id,
        };
        setNotifications((prev) => [matchNotif, ...prev]);
      }

      const existingThread = threads.find((t) => t.profile.id === profile.id);
      if (!existingThread) {
        const newThread: ChatThread = {
          id: `match_${profile.id}_${Date.now()}`,
          profile,
          lastMessage: `You and ${profile.name} matched! Send an icebreaker.`,
          lastMessageTime: 'Just now',
          unreadCount: 0,
          isMatchNew: true,
          messages: [
            {
              id: `sys_${Date.now()}`,
              senderId: 'system',
              text: `It's a Match! You both liked each other. Say hello to ${profile.name}! ✨`,
              timestamp: 'Just now',
              isMe: false,
            },
          ],
        };
        setThreads((prev) => [newThread, ...prev]);
      }
    }
  };

  const handleRewind = () => {
    if (swipedHistory.length === 0) return;
    const [lastSwiped, ...rest] = swipedHistory;
    setSwipedHistory(rest);
    setProfiles((prev) => [lastSwiped, ...prev]);
  };

  const handleResetDeck = () => {
    setProfiles(INITIAL_PROFILES);
    setSwipedHistory([]);
  };

  const handleSendMessage = (threadId: string, text: string) => {
    const userMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: 'Just now',
      isMe: true,
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: text,
            lastMessageTime: 'Just now',
            unreadCount: 0,
            messages: [...thread.messages, userMsg],
          };
        }
        return thread;
      })
    );

    // Simulated responsive reply after 1.2s
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            const replies = [
              `That made me smile! Absolutely, rhythm and harmony are everything! 🎶`,
              `I love that idea! When's good for you this weekend? ☕`,
              `You have great taste! Let's definitely do it! 😊`,
              `Haha yes! Count me in for the festival cadence! 🥁`,
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const matchReply = {
              id: `msg_reply_${Date.now()}`,
              senderId: thread.profile.id,
              text: randomReply,
              timestamp: 'Just now',
              isMe: false,
            };

            if (notificationSettings.messageAlerts) {
              const msgNotif: AppNotification = {
                id: `notif_msg_${Date.now()}`,
                type: 'message',
                title: `Message from ${thread.profile.name}`,
                body: randomReply,
                timestamp: 'Just now',
                read: false,
                senderId: thread.profile.id,
                senderName: thread.profile.name,
                senderAvatar: thread.profile.photos[0],
                actionRoute: 'chat',
              };
              setNotifications((prevNotifs) => [msgNotif, ...prevNotifs]);
            }

            return {
              ...thread,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              unreadCount: activeThreadId === threadId ? 0 : thread.unreadCount + 1,
              messages: [...thread.messages, matchReply],
            };
          }
          return thread;
        })
      );
    }, 1200);
  };

  const handleStartChatFromMatch = (profile: LoverProfile, icebreakerText?: string) => {
    setMatchedCelebration(null);
    let targetThread = threads.find((t) => t.profile.id === profile.id);
    if (!targetThread) {
      targetThread = {
        id: `match_${profile.id}_${Date.now()}`,
        profile,
        lastMessage: icebreakerText || `Matched with ${profile.name}`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        isMatchNew: true,
        messages: [],
      };
      setThreads((prev) => [targetThread!, ...prev]);
    }
    setActiveThreadId(targetThread.id);
    setActiveTab('matches');

    if (icebreakerText) {
      handleSendMessage(targetThread.id, icebreakerText);
    }
  };

  const togglePersona = () => {
    const nextPersona = currentPersona === 'male' ? 'female' : 'male';
    setCurrentPersona(nextPersona);

    if (nextPersona === 'female') {
      setCurrentUserData({
        id: 'me_female',
        name: 'Maya',
        age: 26,
        gender: 'female',
        headline: 'Flute virtuoso & sound designer for game soundtracks',
        bio: 'Passionate about wind harmonies, street festivals, botanical sketches, and pour-over coffee.',
        photos: [
          '/src/assets/images/profile_sophia_female_1794407594119.jpg',
          '/src/assets/images/dating_lovers_hero_1794407595304.jpg',
        ],
        passions: ['Marching & Brass', 'Sound Design', 'Coffee Crawls', 'Botanical Sketching'],
        marchingLoveInterest: 'Marching woodwind section leader & field conductor.',
        occupation: 'Lead Audio Designer',
        education: 'Berklee College of Music',
        heightCm: 169,
        loveLanguage: 'Words of Affirmation & Quality Time',
        zodiac: 'Cancer',
        preferences: {
          genderPreference: 'male',
          ageRange: [22, 38],
          maxDistanceKm: 30,
          onlyVerified: false,
        },
      });
    } else {
      setCurrentUserData({
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        age: CURRENT_USER.age,
        gender: CURRENT_USER.gender,
        headline: CURRENT_USER.headline,
        bio: CURRENT_USER.bio,
        photos: CURRENT_USER.photos,
        passions: CURRENT_USER.passions,
        marchingLoveInterest: CURRENT_USER.marchingLoveInterest,
        occupation: CURRENT_USER.occupation,
        education: CURRENT_USER.education,
        heightCm: CURRENT_USER.heightCm,
        loveLanguage: CURRENT_USER.loveLanguage,
        zodiac: CURRENT_USER.zodiac,
        preferences: {
          genderPreference: 'female',
          ageRange: [21, 35],
          maxDistanceKm: 25,
          onlyVerified: false,
        },
      });
    }
  };

  const handleSaveProfile = (updatedUser: EditableUserProfile) => {
    setCurrentUserData(updatedUser);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('amora_auth_session');
    } catch {
      // safe fallback
    }
    setLoggedInUser(null);
  };

  const handleMarkNotifAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSelectNotification = (notif: AppNotification) => {
    setIsNotificationsOpen(false);
    if (notif.actionRoute === 'chat' || notif.type === 'message') {
      const thread = threads.find((t) => t.profile.id === notif.senderId);
      if (thread) {
        setActiveThreadId(thread.id);
        setActiveTab('matches');
      }
    } else if (notif.relatedProfileId) {
      const p = profiles.find((prof) => prof.id === notif.relatedProfileId);
      if (p) {
        setActiveProfileModal(p);
      }
    }
  };

  const totalUnreadCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {showFlutterCode ? (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col">
            <FlutterCodeViewer onClose={() => setShowFlutterCode(false)} />
          </div>
        ) : (
          <DeviceFrame
            deviceMode={deviceMode}
            onToggleDeviceMode={() =>
              setDeviceMode((prev) => (prev === 'mobile' ? 'pixel' : 'mobile'))
            }
          >
            {/* Screen View Container */}
            <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-stone-50 dark:bg-stone-900">
              {/* In-App Header: Logo on left, Notification Bar opposite the logo on the right */}
              {activeThreadId === null && (
                <header className="shrink-0 h-14 px-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between z-20 select-none">
                  {/* Left: Amora Brand Logo */}
                  <button
                    onClick={() => setActiveTab('swipe')}
                    className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                      <Heart className="w-4 h-4 fill-white" />
                    </div>
                    <span className="font-serif-romance text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                      Amora
                    </span>
                  </button>

                  {/* Right (Opposite the Logo): Notification Bar & Filters */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Dating Preferences"
                      aria-label="Filter dating preferences"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setIsNotificationsOpen(true)}
                      className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Notifications"
                      aria-label="View notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotifsCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-stone-900 animate-pulse">
                          {unreadNotifsCount}
                        </span>
                      )}
                    </button>
                  </div>
                </header>
              )}

              {/* Tab View Switcher */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeTab === 'swipe' && (
                  <SwipeCardDeck
                    profiles={rankedProfiles}
                    onSwipe={handleSwipe}
                    onRewind={handleRewind}
                    canRewind={swipedHistory.length > 0}
                    onOpenProfile={(p) => setActiveProfileModal(p)}
                    onResetDeck={handleResetDeck}
                    onOpenFilter={() => setIsFilterOpen(true)}
                    onOpenAlgorithm={(p) => setExplainingProfile(p)}
                  />
                )}

                {activeTab === 'explore' && (
                  <ExploreGrid
                    profiles={rankedProfiles}
                    onSelectProfile={(p) => setActiveProfileModal(p)}
                    onLikeProfile={(p) => handleSwipe(p, 'right')}
                  />
                )}

                {activeTab === 'matches' && (
                  <ChatView
                    threads={threads}
                    activeThreadId={activeThreadId}
                    onSelectThread={(id) => setActiveThreadId(id)}
                    onSendMessage={handleSendMessage}
                    onOpenProfile={(p) => setActiveProfileModal(p)}
                    newMatches={rankedProfiles}
                  />
                )}

                {activeTab === 'profile' && (
                  <UserProfileView
                    user={currentUserData}
                    onOpenEditProfile={() => setIsEditProfileOpen(true)}
                    onOpenFilter={() => setIsFilterOpen(true)}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    currentPersona={currentPersona}
                    onTogglePersona={togglePersona}
                    loggedInUser={loggedInUser}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                    onSignOut={handleSignOut}
                    onOpenAlgorithm={() => {
                      if (rankedProfiles.length > 0) {
                        setExplainingProfile(rankedProfiles[0]);
                      }
                    }}
                    onViewFlutterCode={() => setShowFlutterCode(true)}
                  />
                )}
              </div>

              {/* Bottom Navigation Bar */}
              {activeThreadId === null && (
                <nav className="shrink-0 h-16 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 grid grid-cols-4 items-center px-2 z-30">
                  {/* Discover */}
                  <button
                    onClick={() => setActiveTab('swipe')}
                    className={`flex flex-col items-center justify-center py-1 transition-colors ${
                      activeTab === 'swipe'
                        ? 'text-rose-600 dark:text-rose-500 font-bold'
                        : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        activeTab === 'swipe' ? 'fill-rose-600 dark:fill-rose-500 stroke-rose-600' : ''
                      }`}
                    />
                    <span className="text-[10px] mt-1 tracking-tight">Discover</span>
                  </button>

                  {/* Explore */}
                  <button
                    onClick={() => setActiveTab('explore')}
                    className={`flex flex-col items-center justify-center py-1 transition-colors ${
                      activeTab === 'explore'
                        ? 'text-rose-600 dark:text-rose-500 font-bold'
                        : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <Compass
                      className={`w-5 h-5 ${
                        activeTab === 'explore' ? 'stroke-rose-600 dark:stroke-rose-500 stroke-[2.5]' : ''
                      }`}
                    />
                    <span className="text-[10px] mt-1 tracking-tight">Explore</span>
                  </button>

                  {/* Matches & Chat */}
                  <button
                    onClick={() => setActiveTab('matches')}
                    className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
                      activeTab === 'matches'
                        ? 'text-rose-600 dark:text-rose-500 font-bold'
                        : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <div className="relative">
                      <MessageCircle
                        className={`w-5 h-5 ${
                          activeTab === 'matches'
                            ? 'fill-rose-600 dark:fill-rose-500 stroke-rose-600'
                            : ''
                        }`}
                      />
                      {totalUnreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white dark:border-stone-900" />
                      )}
                    </div>
                    <span className="text-[10px] mt-1 tracking-tight">Matches</span>
                  </button>

                  {/* Profile */}
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center justify-center py-1 transition-colors ${
                      activeTab === 'profile'
                        ? 'text-rose-600 dark:text-rose-500 font-bold'
                        : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <User
                      className={`w-5 h-5 ${
                        activeTab === 'profile' ? 'stroke-rose-600 dark:stroke-rose-500 stroke-[2.5]' : ''
                      }`}
                    />
                    <span className="text-[10px] mt-1 tracking-tight">Profile</span>
                  </button>
                </nav>
              )}
            </div>
          </DeviceFrame>
        )}
      </main>

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={activeProfileModal}
        onClose={() => setActiveProfileModal(null)}
        onLike={(p) => {
          handleSwipe(p, 'right');
          setActiveProfileModal(null);
        }}
        onPass={(p) => {
          handleSwipe(p, 'left');
          setActiveProfileModal(null);
        }}
        onStartChat={(p) => {
          setActiveProfileModal(null);
          handleStartChatFromMatch(p);
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={currentUserData}
        onSave={handleSaveProfile}
      />

      {/* Filter Sheet Modal */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={currentUserData.preferences}
        onUpdateFilters={(newFilters) =>
          setCurrentUserData((prev) => ({
            ...prev,
            preferences: newFilters,
          }))
        }
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setLoggedInUser(user)}
      />

      {/* Match Chemistry Algorithm Explainer Modal */}
      <AlgorithmExplainerModal
        profile={explainingProfile}
        onClose={() => setExplainingProfile(null)}
        user={currentUserData}
      />

      {/* Match Celebration Overlay */}
      <MatchCelebrationModal
        matchedProfile={matchedCelebration}
        currentUserAvatar={currentUserData.photos[0]}
        onClose={() => setMatchedCelebration(null)}
        onOpenChat={handleStartChatFromMatch}
      />

      {/* Notifications Modal Hub */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifAsRead}
        onMarkAllAsRead={handleMarkAllNotifsAsRead}
        onDeleteNotification={handleDeleteNotif}
        onSelectNotification={handleSelectNotification}
        settings={notificationSettings}
        onUpdateSettings={setNotificationSettings}
      />
    </div>
  );
}
