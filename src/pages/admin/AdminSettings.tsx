import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';

interface SystemSettings {
  id: string;
  exchange_rate: number;
  qr_points_value: number;
  game_multiplier: number;
  referral_bonus: number;
  daily_limit: number;
  money_to_points_rate: number;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<Partial<SystemSettings>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSettings(data);
        setFormData(data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SystemSettings, value: string) => {
    const numValue = field === 'exchange_rate' || field === 'game_multiplier'
      ? parseFloat(value)
      : parseInt(value);

    setFormData(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? '' : numValue
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('system_settings')
        .update({
          exchange_rate: formData.exchange_rate,
          qr_points_value: formData.qr_points_value,
          game_multiplier: formData.game_multiplier,
          referral_bonus: formData.referral_bonus,
          daily_limit: formData.daily_limit,
          money_to_points_rate: formData.money_to_points_rate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings?.id || '');

      if (error) throw error;
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      await fetchSettings();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const isModified = JSON.stringify(settings) !== JSON.stringify(formData);

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7B6EF6]/10 flex items-center justify-center">
            <Settings size={20} className="text-[#7B6EF6]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">System Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure points and rewards parameters</p>
          </div>
        </div>

        {loading ? (
          <div className="card p-8 flex items-center justify-center gap-3">
            <Loader size={20} className="animate-spin text-[#7B6EF6]" />
            <span className="text-gray-600 dark:text-gray-400">Loading settings...</span>
          </div>
        ) : (
          <>
            {message && (
              <div className={`card p-4 flex items-center gap-3 border-2 ${
                message.type === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                )}
                <p className={`text-sm font-600 ${
                  message.type === 'success'
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <div className="space-y-5">
              {/* Exchange Rate */}
              <div className="card p-5">
                <div className="mb-4">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-2">
                    Exchange Rate
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Points awarded per 1 TL spent (e.g., 10 = 10 points per 1 TL)
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.exchange_rate || ''}
                      onChange={e => handleChange('exchange_rate', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                    />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">points/TL</span>
                  </div>
                </div>
              </div>

              {/* QR Points */}
              <div className="card p-5">
                <div className="mb-4">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-2">
                    QR Scan Base Points
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Base points awarded per QR code scan
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.qr_points_value || ''}
                      onChange={e => handleChange('qr_points_value', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                    />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">points</span>
                  </div>
                </div>
              </div>

              {/* Game Multiplier */}
              <div className="card p-5">
                <div className="mb-4">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-2">
                    Game Points Multiplier
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Multiplier for game earnings (e.g., 1.5x = 50% bonus on game points)
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.game_multiplier || ''}
                      onChange={e => handleChange('game_multiplier', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                    />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">x</span>
                  </div>
                </div>
              </div>

              {/* Referral Bonus */}
              <div className="card p-5">
                <div className="mb-4">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-2">
                    Referral Bonus
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Bonus points awarded when referring a new user
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.referral_bonus || ''}
                      onChange={e => handleChange('referral_bonus', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                    />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">points</span>
                  </div>
                </div>
              </div>

              {/* Daily Limit */}
              <div className="card p-5">
                <div className="mb-4">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-2">
                    Daily Point Limit
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Maximum points a user can earn per day
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.daily_limit || ''}
                      onChange={e => handleChange('daily_limit', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                    />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">points/day</span>
                  </div>
                </div>
              </div>

              {/* Money to Points Rate */}
              <div className="card p-5">
                <div className="mb-4">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-3">
                    Money to Points Conversion Rate
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    Set how many points equals how much money (e.g., 10$ = 100 points)
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Amount ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="10"
                        value={formData.money_to_points_rate || ''}
                        onChange={e => handleChange('money_to_points_rate', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                      />
                    </div>
                    <div className="text-2xl font-black text-gray-400">=</div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Points</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="100"
                        value={formData.money_to_points_rate ? (formData.money_to_points_rate * 10) : ''}
                        onChange={e => handleChange('money_to_points_rate', (parseInt(e.target.value) / 10).toString())}
                        className="w-full px-4 py-3 rounded-xl border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                    Example: If you set 1$ = 10 points, then 10$ will equal 100 points
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={!isModified || saving}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-white transition-all ${
                  isModified && !saving
                    ? 'bg-[#7B6EF6] hover:bg-[#6B5EE6] border-2 border-black dark:border-gray-600 cursor-pointer shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>

              {/* Info Box */}
              <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-900 dark:text-blue-200 font-600 leading-relaxed">
                  All changes take effect immediately. Users will see updated point values on their next action. Consider notifying users of significant changes via the notifications system.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
