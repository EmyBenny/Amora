export type Gender = 'female' | 'male' | 'non-binary';

export interface VoicePrompt {
  title: string;
  durationSeconds: number;
  audioUrl?: string;
}

export interface DatingPrompt {
  question: string;
  answer: string;
}

export interface LoverProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  headline: string;
  bio: string;
  distanceKm: number;
  photos: string[];
  verified: boolean;
  matchScore: number; // percentage compatibility
  passions: string[];
  marchingLoveInterest?: string; // Marching band / musical festival / rhythm connection
  occupation: string;
  education: string;
  heightCm: number;
  loveLanguage: string;
  zodiac: string;
  voicePrompt?: VoicePrompt;
  prompts: DatingPrompt[];
}

export interface FilterSettings {
  genderPreference: 'all' | 'female' | 'male';
  ageRange: [number, number];
  maxDistanceKm: number;
  onlyVerified: boolean;
  passionFilter?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  type?: 'text' | 'voice' | 'icebreaker' | 'date_invite';
  voiceDuration?: string;
}

export interface ChatThread {
  id: string;
  profile: LoverProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isMatchNew?: boolean;
}

export type NotificationType =
  | 'new_match'
  | 'message'
  | 'super_like'
  | 'date_invite'
  | 'marching_event'
  | 'chemistry_alert';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  actionRoute?: string;
  relatedProfileId?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  matchAlerts: boolean;
  messageAlerts: boolean;
  marchingAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
