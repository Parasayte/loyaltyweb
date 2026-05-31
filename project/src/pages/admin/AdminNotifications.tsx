import React, { useState } from 'react';
import { Plus, Trash2, Send, X, Check, Megaphone, Bell, Users, Star } from 'lucide-react';
import AdminLayout from './AdminLayout';

const announcements = [
  { id: '1', title: 'Summer Event Launch', message: 'The Summer Splash event is now live! Earn 2x points on all activities.', type: 'event', audience: 'all', sent: '2026-05-25', status: 'sent' },
  { id: '2', title: 'New Reward Added', message: 'Wireless Earbuds are now available in the Rewards Shop!', type: 'reward', audience: 'all', sent: '2026-05-24', status: 'sent' },
  { id: '3', title: 'Weekend Bonus', message: 'This weekend only: earn 1.5x points on QR scans!', type: 'promo', audience: 'active', sent: '', status: 'draft' },
];

const AdminNotifications: React.FC = () => {
  const [items, setItems] = useState(announcements);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'announcement', audience: 'all' });
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSend = () => {
    setSaved(true);
    setItems(prev => [{
      id: Date.now().toString(),
      ...form,
      sent: new Date().toISOString().split('T')[0],
      status: 'sent',
    }, ...prev]);
    setTimeout(() => { setSaved(false); setShowModal(false); setForm({ title: '', message: '', type: 'announcement', audience: 'all' }); }, 800);
  };

  return (
    <AdminLayout>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="animate-bounce-in card max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-lg text-gray-900 dark:text-white">Create Announcement</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-sm mb-2">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" placeholder="Announcement title" />
              </div>
              <div>
                <label className="block font-bold text-sm mb-2">Message</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field resize-none" rows={4} placeholder="Write your message..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sm mb-2">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                    <option value="reward">Reward</option>
                    <option value="promo">Promotion</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm mb-2">Audience</label>
                  <select value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="input-field">
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="new">New Users</option>
                    <option value="vip">VIP Users</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            {form.title && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-xs font-bold text-gray-500 mb-2">PREVIEW</p>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#7B6EF6]/10 flex items-center justify-center">
                    <Bell size={14} className="text-[#7B6EF6]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{form.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{form.message}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSend} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saved ? <><Check size={14} /> Sent!</> : <><Send size={14} /> Send Notification</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Notifications</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
            <Plus size={14} /> Create
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sent Today', value: '3', icon: Send, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
            { label: 'Total Reach', value: '12,481', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
            { label: 'Avg. Open Rate', value: '67%', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          ].map(card => (
            <div key={card.label} className="card p-4 text-center">
              <div className={`w-10 h-10 rounded-2xl ${card.bg} flex items-center justify-center mx-auto mb-2`}>
                <card.icon size={16} className={card.color} />
              </div>
              <p className="font-black text-xl text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                item.type === 'event' ? 'bg-blue-100 dark:bg-blue-900/30' :
                item.type === 'reward' ? 'bg-green-100 dark:bg-green-900/30' :
                'bg-[#7B6EF6]/10 dark:bg-[#4F8EF7]/20'
              }`}>
                <Megaphone size={16} className={
                  item.type === 'event' ? 'text-blue-500' :
                  item.type === 'reward' ? 'text-green-500' :
                  'text-[#7B6EF6] dark:text-[#4F8EF7]'
                } />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                  <span className={`badge text-xs flex-shrink-0 ${item.status === 'sent' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1 capitalize"><Bell size={10} />{item.type}</span>
                  <span className="flex items-center gap-1"><Users size={10} />{item.audience} users</span>
                  {item.sent && <span>{item.sent}</span>}
                </div>
              </div>
              <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
