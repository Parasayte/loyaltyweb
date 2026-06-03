import React, { useState } from 'react';
import { Sun, Moon, Bell, Volume2, VolumeX, Globe, User, Shield, ChevronRight, Check, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { tr } from '../lib/tr';

const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative w-12 h-6 rounded-full border-2 border-black dark:border-gray-500 transition-colors duration-200 ${value ? 'bg-[#7B6EF6] dark:bg-[#4F8EF7]' : 'bg-gray-200 dark:bg-gray-700'}`}
  >
    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
  </button>
);

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h2 className="font-black text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">{title}</h2>
    <div className="card overflow-hidden divide-y-2 divide-black dark:divide-gray-700">
      {children}
    </div>
  </div>
);

const SettingsRow: React.FC<{
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  value?: React.ReactNode;
  onClick?: () => void;
  iconColor?: string;
}> = ({ icon: Icon, label, value, onClick, iconColor = 'text-gray-600 dark:text-gray-400' }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors' : ''}`}
    onClick={onClick}
  >
    <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className={iconColor} />
    </div>
    <span className="flex-1 font-medium text-sm text-gray-900 dark:text-white">{label}</span>
    {value !== undefined ? value : onClick ? <ChevronRight size={16} className="text-gray-400" /> : null}
  </div>
);

const languages = ['English', 'Spanish', 'French', 'German', 'Japanese'];

const Settings: React.FC = () => {
  const { theme, toggleTheme, soundEnabled, setSoundEnabled, notificationsEnabled, setNotificationsEnabled, setIsLoggedIn } = useApp();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [activityAlerts, setActivityAlerts] = useState(true);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white">Settings</h1>

      <SettingsSection title="Appearance">
        <SettingsRow
          icon={theme === 'light' ? Sun : Moon}
          label="Theme"
          iconColor={theme === 'light' ? 'text-amber-500' : 'text-blue-400'}
          value={
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 p-0.5">
              <button
                onClick={e => { e.stopPropagation(); if (theme === 'dark') toggleTheme(); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500'}`}
              >
                Light
              </button>
              <button
                onClick={e => { e.stopPropagation(); if (theme === 'light') toggleTheme(); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500'}`}
              >
                Dark
              </button>
            </div>
          }
        />
      </SettingsSection>

      <SettingsSection title="Language & Region">
        <div
          className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => setShowLangPicker(!showLangPicker)}
        >
          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Globe size={16} className="text-blue-500" />
          </div>
          <span className="flex-1 font-medium text-sm text-gray-900 dark:text-white">Language</span>
          <span className="text-sm text-[#7B6EF6] dark:text-[#4F8EF7] font-bold">{language}</span>
          <ChevronRight size={16} className={`text-gray-400 transition-transform ${showLangPicker ? 'rotate-90' : ''}`} />
        </div>
        {showLangPicker && (
          <div className="border-t-2 border-black dark:border-gray-700">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
              >
                <span className={`font-medium ${lang === language ? 'text-[#7B6EF6] dark:text-[#4F8EF7]' : 'text-gray-700 dark:text-gray-300'}`}>{lang}</span>
                {lang === language && <Check size={14} className="text-[#7B6EF6] dark:text-[#4F8EF7]" />}
              </button>
            ))}
          </div>
        )}
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsRow icon={Bell} label="Push Notifications" iconColor="text-[#7B6EF6] dark:text-[#4F8EF7]"
          value={<Toggle value={notificationsEnabled} onChange={setNotificationsEnabled} />}
        />
        <SettingsRow icon={Bell} label="Email Notifications" iconColor="text-blue-500"
          value={<Toggle value={emailNotifs} onChange={setEmailNotifs} />}
        />
        <SettingsRow icon={Bell} label="Activity Alerts" iconColor="text-green-500"
          value={<Toggle value={activityAlerts} onChange={setActivityAlerts} />}
        />
      </SettingsSection>

      <SettingsSection title="Sound">
        <SettingsRow
          icon={soundEnabled ? Volume2 : VolumeX}
          label="Sound Effects"
          iconColor={soundEnabled ? 'text-green-500' : 'text-gray-400'}
          value={<Toggle value={soundEnabled} onChange={setSoundEnabled} />}
        />
      </SettingsSection>

      <SettingsSection title="Account">
        <SettingsRow icon={User} label="Edit Profile" iconColor="text-gray-600 dark:text-gray-400" onClick={() => navigate('/profile')} />
        <SettingsRow icon={Shield} label="Privacy & Security" iconColor="text-blue-500" onClick={() => {}} />
        <SettingsRow icon={Shield} label="Change Password" iconColor="text-amber-500" onClick={() => {}} />
      </SettingsSection>

      <button
        onClick={() => { setIsLoggedIn(false); navigate('/login'); }}
        className="btn-danger w-full flex items-center justify-center gap-2"
      >
        <LogOut size={16} />
        <span>Log Out</span>
      </button>

      <p className="text-center text-xs text-gray-400">NexReward v2.0.0 • Frontend Demo</p>
    </div>
  );
};

export default Settings;
