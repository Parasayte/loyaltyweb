import React, { useState } from 'react';
import { Trophy, Star, Crown, TrendingUp } from 'lucide-react';
import { leaderboard } from '../data/mockData';

const Leaderboard: React.FC = () => {
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white">Leaderboard</h1>

      {/* Tab */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-black dark:border-gray-600 p-1">
        {(['weekly', 'monthly', 'alltime'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs capitalize transition-all ${
              tab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-black dark:border-gray-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t === 'alltime' ? 'All Time' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
        <h2 className="text-center font-black text-gray-700 dark:text-gray-300 mb-6">Top 3</h2>
        <div className="flex items-end justify-center gap-4">
          {podiumOrder.map((player, i) => {
            const podiumHeight = [16, 24, 12][i];
            const rankBadge = player?.rank === 1 ? '👑' : player?.rank === 2 ? '🥈' : '🥉';
            const isFirst = player?.rank === 1;
            return (
              <div key={player?.rank} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className={`rounded-full overflow-hidden border-4 ${
                    isFirst ? 'border-amber-400 w-20 h-20' : 'border-gray-300 dark:border-gray-600 w-16 h-16'
                  }`}>
                    {player?.avatar && <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />}
                  </div>
                  <div className="absolute -top-2 -right-2 text-xl">{rankBadge}</div>
                </div>
                <p className={`font-black text-gray-900 dark:text-white text-center ${isFirst ? 'text-base' : 'text-sm'}`}>{player?.username}</p>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-amber-500" fill="currentColor" />
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{player?.points.toLocaleString()}</span>
                </div>
                <div
                  className={`w-20 rounded-t-2xl flex items-center justify-center border-2 border-black dark:border-gray-600 ${
                    isFirst ? 'bg-amber-400 h-24' : i === 0 ? 'bg-gray-300 dark:bg-gray-600 h-16' : 'bg-orange-300 dark:bg-orange-700 h-12'
                  }`}
                >
                  <span className="text-2xl font-black text-white">#{player?.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rest of rankings */}
      <div className="space-y-2">
        {rest.map(player => (
          <div
            key={player.rank}
            className={`card p-4 flex items-center gap-4 transition-all ${player.isCurrentUser ? 'border-[#7B6EF6] dark:border-[#4F8EF7] bg-[#7B6EF6]/5 dark:bg-[#4F8EF7]/5' : 'hover:shadow-md'}`}
          >
            <div className="w-8 text-center">
              <span className={`font-black text-lg ${player.rank <= 10 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>#{player.rank}</span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black dark:border-gray-600 flex-shrink-0">
              <img src={player.avatar} alt={player.username} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${player.username}&background=7B6EF6&color=fff`; }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`font-bold text-sm text-gray-900 dark:text-white ${player.isCurrentUser ? 'text-[#7B6EF6] dark:text-[#4F8EF7]' : ''}`}>
                  {player.username}
                </p>
                {player.isCurrentUser && <span className="badge bg-[#7B6EF6]/10 dark:bg-[#4F8EF7]/20 text-[#7B6EF6] dark:text-[#4F8EF7] text-xs">You</span>}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Level {player.level}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-500" fill="currentColor" />
              <span className="font-black text-sm text-amber-600 dark:text-amber-400">{player.points.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Your ranking */}
      <div className="card p-4 bg-[#7B6EF6]/5 dark:bg-[#4F8EF7]/10 border-[#7B6EF6] dark:border-[#4F8EF7]">
        <div className="flex items-center gap-3">
          <Trophy size={20} className="text-[#7B6EF6] dark:text-[#4F8EF7]" />
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Your Ranking</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">You're in the top 25%!</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-black text-2xl text-[#7B6EF6] dark:text-[#4F8EF7]">#3</p>
            <div className="flex items-center gap-1 justify-end">
              <TrendingUp size={12} className="text-green-500" />
              <span className="text-xs text-green-500 font-bold">+2 this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
