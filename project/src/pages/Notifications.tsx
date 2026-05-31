import React, { useState } from 'react';
import { Bell, Check, Trash2, Gift, Trophy, Star, Megaphone, Activity } from 'lucide-react';
import { notifications as initialNotifs } from '../data/mockData';

const typeIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  reward: Gift,
  achievement: Trophy,
  points: Star,
  event: Megaphone,
  system: Activity,
};

const typeColors: Record<string, string> = {
  reward: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  achievement: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  points: 'bg-[#7B6EF6]/10 dark:bg-[#4F8EF7]/20 text-[#7B6EF6] dark:text-[#4F8EF7]',
  event: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  system: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

const Notifications: React.FC = () => {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n => !n.read) : notifs.filter(n => n.type === filter);
  const unreadCount = notifs.filter(n => !n.read).length;

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-2xl mx-auto overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#7B6EF6] dark:text-[#4F8EF7] hover:underline">
            <Check size={12} className="sm:w-3.5 sm:h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 sm:-mx-4 px-3 sm:px-4 lg:mx-0 lg:px-0">
        {['all', 'unread', 'reward', 'achievement', 'points', 'event'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 font-bold text-xs sm:text-sm capitalize whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-[#7B6EF6] dark:bg-[#4F8EF7] text-white border-black dark:border-gray-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-black dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <Bell size={36} className="sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-bold text-gray-500">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(notif => {
            const IconComp = typeIcons[notif.type] || Bell;
            const colorClass = typeColors[notif.type] || typeColors.system;
            return (
              <div
                key={notif.id}
                className={`card p-3 sm:p-4 flex items-start gap-2 sm:gap-3 transition-all cursor-pointer hover:shadow-md ${
                  !notif.read ? 'border-l-4 border-[#7B6EF6] dark:border-[#4F8EF7]' : ''
                }`}
                onClick={() => markRead(notif.id)}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  <IconComp size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-bold text-xs sm:text-sm ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-[#7B6EF6] dark:bg-[#4F8EF7] flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
