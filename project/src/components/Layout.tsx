import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ShoppingBag, Gamepad2, BarChart2, QrCode, Trophy,
  Target, Bell, History, Settings, User, Package, ChevronRight,
  Sun, Moon, Menu, X, Star, Zap, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RewardPopup from './RewardPopup';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/shop', icon: ShoppingBag, label: 'Shop' },
  { path: '/games', icon: Gamepad2, label: 'Games' },
  { path: '/progress', icon: BarChart2, label: 'Progress' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const sidebarItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/shop', icon: ShoppingBag, label: 'Rewards Shop' },
  { path: '/inventory', icon: Package, label: 'Inventory' },
  { path: '/games', icon: Gamepad2, label: 'Mini Games' },
  { path: '/progress', icon: BarChart2, label: 'Progress Path' },
  { path: '/qr', icon: QrCode, label: 'QR Scanner' },
  { path: '/redeem', icon: Star, label: 'Redeem Points' },
  { path: '/achievements', icon: Trophy, label: 'Achievements' },
  { path: '/missions', icon: Target, label: 'Daily Missions' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/stats', icon: BarChart2, label: 'Statistics' },
  { path: '/events', icon: Zap, label: 'Events' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/support', icon: ChevronRight, label: 'Support' },
  { path: '/admin', icon: Shield, label: 'Admin' },
];

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideNav }) => {
  const { theme, toggleTheme, points, rewardPopup, dismissRewardPopup } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthPage) {
    return (
      <div className="page-container">
        {rewardPopup && <RewardPopup data={rewardPopup} onDismiss={dismissRewardPopup} />}
        {children}
        <button
          onClick={toggleTheme}
          className="btn-primary fixed top-4 right-4 p-3 z-50 rounded-button"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    );
  }

  return (
    <div className="page-container flex overflow-x-hidden">
      {rewardPopup && <RewardPopup data={rewardPopup} onDismiss={dismissRewardPopup} />}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(11, 12, 16, 0.7)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 card rounded-0 lg:static lg:flex lg:flex-col overflow-y-auto z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 border-r-4 border-b-0`}
        style={{
          background: 'var(--card-bg)',
          borderRadius: '0',
          boxShadow: 'none',
        }}
      >
        <div className="p-6 divider-dashed">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-button flex items-center justify-center flex-shrink-0 font-black text-lg"
              style={{
                background: 'linear-gradient(180deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                color: 'white',
                border: '2.5px solid var(--dark-border)',
                boxShadow: '0px 5px 0px var(--dark-border)',
              }}
            >
              N
            </div>
            <div>
              <h1 style={{ color: 'var(--text-dark)' }} className="font-black text-lg">NexReward</h1>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs">Loyalty Platform</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-2 rounded-button lg:hidden btn-secondary"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Points card */}
        <div className="p-4">
          <div
            className="card p-4 flex items-center gap-3"
            style={{
              background: 'var(--tab-bg)',
              border: '2.5px solid var(--dark-border)',
              boxShadow: '0px 3px 0px var(--dark-border)',
            }}
          >
            <div
              className="w-9 h-9 rounded-button flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(180deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                color: 'white',
                border: '2px solid var(--dark-border)',
              }}
            >
              <Star size={14} fill="white" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs font-600">Your Points</p>
              <p style={{ color: 'var(--text-dark)' }} className="font-black text-lg">{points.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button transition-all text-left text-sm font-600"
              style={{
                background: location.pathname === item.path ? 'linear-gradient(180deg, var(--gradient-start) 0%, var(--gradient-end) 100%)' : 'var(--card-bg)',
                color: location.pathname === item.path ? 'white' : 'var(--text-dark)',
                border: '2.5px solid var(--dark-border)',
                boxShadow: location.pathname === item.path ? '0px 4px 0px var(--dark-border)' : '0px 3px 0px var(--dark-border)',
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {location.pathname === item.path && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="p-3 divider-dashed">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-button btn-secondary"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 border-b-4"
          style={{
            background: 'var(--card-bg)',
            borderColor: 'var(--dark-border)',
          }}
        >
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-secondary p-2 rounded-button">
            <Menu size={18} />
          </button>
          <div className="hidden lg:flex items-center gap-2 flex-1">
            <span style={{ color: 'var(--text-muted)' }} className="text-sm font-600">Welcome back,</span>
            <span style={{ color: 'var(--text-dark)' }} className="font-black">StarPlayer99</span>
          </div>

          {/* Points display */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-button"
            style={{
              background: 'var(--tab-bg)',
              border: '2.5px solid var(--dark-border)',
              boxShadow: '0px 2px 0px var(--dark-border)',
            }}
          >
            <Star size={14} style={{ color: '#f59e0b' }} fill="currentColor" />
            <span style={{ color: 'var(--text-dark)' }} className="font-black text-sm">{points.toLocaleString()}</span>
          </div>

          <button onClick={toggleTheme} className="btn-secondary p-3 rounded-button">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="btn-secondary p-3 rounded-button relative"
          >
            <Bell size={18} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: '#ef4444' }}
            />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-6">
          {children}
        </main>

        {/* Bottom nav (mobile) */}
        {!hideNav && (
          <nav
            className="fixed bottom-0 left-0 right-0 lg:hidden px-2 py-2 z-30 border-t-4"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--dark-border)',
            }}
          >
            <div className="flex items-center justify-around">
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-button transition-all"
                  style={{
                    background: location.pathname === item.path ? 'linear-gradient(180deg, var(--gradient-start) 0%, var(--gradient-end) 100%)' : 'transparent',
                    color: location.pathname === item.path ? 'white' : 'var(--text-muted)',
                  }}
                >
                  <item.icon size={20} />
                  <span className="text-xs font-600">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Layout;
