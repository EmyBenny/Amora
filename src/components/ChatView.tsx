import React, { useState } from 'react';
import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  Mic,
  Calendar,
  CheckCheck,
  Music,
  Smile,
  Volume2,
} from 'lucide-react';
import { ChatThread, LoverProfile } from '../types';

interface ChatViewProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string | null) => void;
  onSendMessage: (threadId: string, text: string) => void;
  onOpenProfile: (profile: LoverProfile) => void;
  newMatches: LoverProfile[];
}

export const ChatView: React.FC<ChatViewProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  onOpenProfile,
  newMatches,
}) => {
  const [inputText, setInputText] = useState('');
  const [showDatePrompt, setShowDatePrompt] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeThreadId) return;
    onSendMessage(activeThreadId, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (!activeThreadId) return;
    onSendMessage(activeThreadId, promptText);
  };

  // If viewing a specific conversation
  if (activeThread) {
    const profile = activeThread.profile;
    return (
      <div className="flex-1 flex flex-col h-full bg-stone-50 dark:bg-stone-900 overflow-hidden">
        {/* Chat Room Header */}
        <div className="px-4 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectThread(null)}
              className="p-1 -ml-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg transition-colors"
              aria-label="Back to threads"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => onOpenProfile(profile)}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200 ring-2 ring-rose-500/30">
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                  <span>{profile.name}</span>
                  <span className="text-[11px] font-normal text-stone-400">
                    · {profile.matchScore}%
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 truncate max-w-[140px] sm:max-w-[200px]">
                  {profile.occupation}
                </div>
              </div>
            </button>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1 text-stone-600 dark:text-stone-300">
            <button
              onClick={() => setShowDatePrompt(!showDatePrompt)}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-rose-600 dark:text-rose-400 transition-colors"
              title="Plan a date"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`Simulating voice call with ${profile.name}... Ringing 📞`)}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`Simulating video rendezvous with ${profile.name}... 🎥`)}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date Invitation Banner */}
        {showDatePrompt && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900 p-3 shrink-0 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Invite {profile.name} to grab coffee this Friday at 6:30 PM?</span>
            </div>
            <button
              onClick={() => {
                handleQuickPrompt(`Hey ${profile.name}, are you free this Friday at 6:30 PM for coffee and vinyl records? ☕`);
                setShowDatePrompt(false);
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors"
            >
              Send Invite
            </button>
          </div>
        )}

        {/* Message Bubble Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Match announcement pill */}
          <div className="flex justify-center my-2">
            <div className="px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-400 font-medium text-center">
              Matched with {profile.name} · {profile.passions[0]} connection
            </div>
          </div>

          {activeThread.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.isMe
                    ? 'bg-rose-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-xs border border-stone-200/70 dark:border-stone-700'
                }`}
              >
                {msg.type === 'voice' ? (
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span>Voice Note ({msg.voiceDuration || '0:14'})</span>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-400 px-1">
                <span>{msg.timestamp}</span>
                {msg.isMe && <CheckCheck className="w-3 h-3 text-rose-500" />}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Icebreaker Suggestions */}
        <div className="px-3 py-2 bg-stone-100/90 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => handleQuickPrompt(`What's the best marching band fanfare you've ever heard live? 🎺`)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] whitespace-nowrap border border-stone-200 dark:border-stone-700 hover:border-rose-400 transition-colors flex items-center gap-1"
          >
            <Music className="w-3 h-3 text-rose-500" />
            <span>Marching fanfare debate</span>
          </button>
          <button
            onClick={() => handleQuickPrompt(`Cortado or pour-over for our first coffee walk? ☕`)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] whitespace-nowrap border border-stone-200 dark:border-stone-700 hover:border-rose-400 transition-colors"
          >
            Coffee preference
          </button>
          <button
            onClick={() => handleQuickPrompt(`I promise to make you laugh on our first date! 😉`)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] whitespace-nowrap border border-stone-200 dark:border-stone-700 hover:border-rose-400 transition-colors flex items-center gap-1"
          >
            <Smile className="w-3 h-3 text-amber-500" />
            <span>Playful dare</span>
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              onSendMessage(activeThread.id, '🎙️ [Voice message sent: 0:12]');
            }}
            className="p-2 text-stone-400 hover:text-rose-500 rounded-full transition-colors"
            title="Record Voice Note"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${profile.name}...`}
            className="flex-1 py-2 px-3.5 text-xs sm:text-sm rounded-full bg-stone-100 dark:bg-stone-800 border-none focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-900 dark:text-white placeholder-stone-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Thread list view
  return (
    <div className="flex-1 flex flex-col h-full bg-stone-50 dark:bg-stone-900 overflow-y-auto">
      {/* New Matches Reel */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase tracking-wider font-bold text-stone-400">
            New Matches ({newMatches.length})
          </h2>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            Ready to chat
          </span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-1 no-scrollbar">
          {newMatches.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                const thread = threads.find((t) => t.profile.id === m.id);
                if (thread) {
                  onSelectThread(thread.id);
                }
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-stone-900">
                  <img
                    src={m.photos[0]}
                    alt={m.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900" />
              </div>
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 max-w-[60px] truncate">
                {m.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread List */}
      <div className="flex-1 p-3 space-y-1">
        <h2 className="text-xs uppercase tracking-wider font-bold text-stone-400 px-2 py-1">
          Recent Conversations
        </h2>

        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className="w-full p-3 rounded-2xl bg-white dark:bg-stone-850 hover:bg-stone-100/80 dark:hover:bg-stone-800 border border-stone-200/70 dark:border-stone-800 transition-colors flex items-center gap-3.5 text-left shadow-xs"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-stone-200">
              <img
                src={thread.profile.photos[0]}
                alt={thread.profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {thread.unreadCount > 0 && (
                <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white dark:border-stone-900" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-bold text-stone-900 dark:text-white truncate">
                  {thread.profile.name}
                </span>
                <span className="text-[11px] text-stone-400 shrink-0">
                  {thread.lastMessageTime}
                </span>
              </div>
              <p
                className={`text-xs truncate ${
                  thread.unreadCount > 0
                    ? 'font-semibold text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {thread.lastMessage}
              </p>
            </div>

            {thread.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {thread.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
