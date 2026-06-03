import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Star, Activity } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { statsData } from '../../data/mockData';
import { tr } from '../../lib/tr';

const monthlyActive = [
  { month: 'Jan', users: 8200 },
  { month: 'Feb', users: 9100 },
  { month: 'Mar', users: 10400 },
  { month: 'Apr', users: 9800 },
  { month: 'May', users: 11200 },
  { month: 'Jun', users: 12480 },
];

const rewardPopularity = [
  { name: 'Gift Cards', value: 35 },
  { name: 'Food & Drink', value: 28 },
  { name: 'Entertainment', value: 18 },
  { name: 'Coupons', value: 12 },
  { name: 'Electronics', value: 7 },
];

const engagement = [
  { day: 'Mon', qr: 840, games: 1200, missions: 600 },
  { day: 'Tue', qr: 920, games: 1400, missions: 700 },
  { day: 'Wed', qr: 760, games: 980, missions: 520 },
  { day: 'Thu', qr: 1100, games: 1600, missions: 800 },
  { day: 'Fri', qr: 1300, games: 1900, missions: 950 },
  { day: 'Sat', qr: 1800, games: 2400, missions: 1200 },
  { day: 'Sun', qr: 1600, games: 2100, missions: 1050 },
];

const COLORS = ['#7B6EF6', '#4F8EF7', '#22c55e', '#f59e0b', '#ef4444'];

const AdminAnalytics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Analytics</h1>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Active Users', value: '12,480', change: '+8.2%', icon: Users, color: 'text-blue-500' },
            { label: 'Avg. Session', value: '8.4 min', change: '+1.2m', icon: Activity, color: 'text-green-500' },
            { label: 'Points/Day', value: '48,200', change: '+5.1%', icon: Star, color: 'text-amber-500' },
            { label: 'Retention', value: '72%', change: '+2.4%', icon: TrendingUp, color: 'text-[#7B6EF6]' },
          ].map(kpi => (
            <div key={kpi.label} className="card p-4">
              <kpi.icon size={18} className={`${kpi.color} mb-2`} />
              <p className="font-black text-xl text-gray-900 dark:text-white">{kpi.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
              <p className="text-xs font-bold text-green-500 mt-1">{kpi.change}</p>
            </div>
          ))}
        </div>

        {/* Monthly active users */}
        <div className="card p-5">
          <h2 className="font-black text-gray-900 dark:text-white mb-4">Monthly Active Users</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyActive}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7B6EF6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7B6EF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="users" stroke="#7B6EF6" fill="url(#userGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement by type */}
        <div className="card p-5">
          <h2 className="font-black text-gray-900 dark:text-white mb-4">Weekly Engagement by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="qr" name="QR Scans" fill="#4F8EF7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="games" name="Games" fill="#7B6EF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="missions" name="Missions" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reward popularity */}
        <div className="card p-5">
          <h2 className="font-black text-gray-900 dark:text-white mb-4">Reward Category Popularity</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={rewardPopularity} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {rewardPopularity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ border: '2px solid #000', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {rewardPopularity.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{item.name}</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
