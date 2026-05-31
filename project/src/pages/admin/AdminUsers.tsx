import React, { useState } from 'react';
import { Search, CreditCard as Edit3, Slash, Eye, Plus, X, Check, ChevronDown } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { adminUsers } from '../../data/mockData';

type UserType = typeof adminUsers[0];

const UserModal: React.FC<{ user: UserType; onClose: () => void; mode: 'view' | 'edit' | 'suspend' }> = ({ user, onClose, mode }) => {
  const [status, setStatus] = useState(user.status);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(onClose, 1000); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="animate-bounce-in card max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-lg text-gray-900 dark:text-white">
            {mode === 'view' ? 'User Profile' : mode === 'edit' ? 'Edit User' : 'Suspend User'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><X size={18} /></button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full border-2 border-black dark:border-gray-600 object-cover" />
          <div>
            <p className="font-black text-xl text-gray-900 dark:text-white">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className={`badge text-xs mt-1 ${user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>{user.status}</span>
          </div>
        </div>

        {mode === 'view' && (
          <div className="space-y-3">
            {[
              { label: 'Level', value: `${user.level}` },
              { label: 'Total Points', value: user.points.toLocaleString() },
              { label: 'Status', value: user.status },
              { label: 'Joined', value: new Date(user.joinDate).toLocaleDateString() },
            ].map(row => (
              <div key={row.label} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-400">{row.label}</span>
                <span className="font-bold text-sm text-gray-900 dark:text-white capitalize">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {mode === 'edit' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-sm mb-2">Username</label>
              <input defaultValue={user.username} className="input-field" />
            </div>
            <div>
              <label className="block font-bold text-sm mb-2">Email</label>
              <input defaultValue={user.email} className="input-field" />
            </div>
            <div>
              <label className="block font-bold text-sm mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input-field">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {mode === 'suspend' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-700">
              <p className="font-bold text-red-700 dark:text-red-400">Suspend {user.username}?</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">This will prevent the user from accessing their account.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-red-700 transition-colors">
                {saved ? 'Suspended!' : 'Suspend User'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ user: UserType; mode: 'view' | 'edit' | 'suspend' } | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = adminUsers.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      {modal && <UserModal user={modal.user} mode={modal.mode} onClose={() => setModal(null)} />}
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto overflow-x-hidden">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Users</h1>
          <button className="btn-primary flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm">
            <Plus size={12} className="sm:w-3.5 sm:h-3.5" /> Add User
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3 flex-wrap items-stretch">
          <div className="relative flex-1 min-w-0 sm:min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-4 sm:h-4" />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-8 sm:pl-9 py-1.5 sm:py-2 w-full text-sm" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field py-1.5 sm:py-2 w-auto pr-8 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:mx-0">
            <table className="w-full min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="border-b-2 border-black dark:border-gray-700">
                  <th className="text-left p-3 sm:p-4 text-xs font-black text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left p-3 sm:p-4 text-xs font-black text-gray-500 uppercase tracking-wider hidden sm:table-cell">Level</th>
                  <th className="text-left p-3 sm:p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="text-left p-3 sm:p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left p-3 sm:p-4 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="p-3 sm:p-4" />
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-gray-700">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-black dark:border-gray-600 object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">{user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell"><span className="font-bold text-xs sm:text-sm">Lv.{user.level}</span></td>
                    <td className="p-3 sm:p-4"><span className="font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400">{user.points.toLocaleString()}</span></td>
                    <td className="p-3 sm:p-4">
                      <span className={`badge text-xs ${user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-xs text-gray-500 hidden md:table-cell">{new Date(user.joinDate).toLocaleDateString()}</td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <button onClick={() => setModal({ user, mode: 'view' })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-500 transition-colors">
                          <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                        <button onClick={() => setModal({ user, mode: 'edit' })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-[#7B6EF6] transition-colors">
                          <Edit3 size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                        <button onClick={() => setModal({ user, mode: 'suspend' })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors">
                          <Slash size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
