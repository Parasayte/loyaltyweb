import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Inventory from './pages/Inventory';
import RewardsShop from './pages/RewardsShop';
import MiniGames from './pages/MiniGames';
import ProgressPath from './pages/ProgressPath';
import QRScanner from './pages/QRScanner';
import RedeemPoints from './pages/RedeemPoints';
import Achievements from './pages/Achievements';
import Missions from './pages/Missions';
import Notifications from './pages/Notifications';
import History from './pages/History';
import Settings from './pages/Settings';
import Support from './pages/Support';
import SeasonalEvents from './pages/SeasonalEvents';
import Leaderboard from './pages/Leaderboard';
import UserStats from './pages/UserStats';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRewards from './pages/admin/AdminRewards';
import AdminEvents from './pages/admin/AdminEvents';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminQR from './pages/admin/AdminQR';
import AdminGames from './pages/admin/AdminGames';

// Error pages
import { NotFound, NoConnection, Maintenance } from './pages/ErrorPages';

const WrappedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout>{children}</Layout>
);

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main app pages (wrapped in layout) */}
          <Route path="/" element={<WrappedPage><Home /></WrappedPage>} />
          <Route path="/profile" element={<WrappedPage><Profile /></WrappedPage>} />
          <Route path="/inventory" element={<WrappedPage><Inventory /></WrappedPage>} />
          <Route path="/shop" element={<WrappedPage><RewardsShop /></WrappedPage>} />
          <Route path="/games" element={<WrappedPage><MiniGames /></WrappedPage>} />
          <Route path="/progress" element={<WrappedPage><ProgressPath /></WrappedPage>} />
          <Route path="/qr" element={<WrappedPage><QRScanner /></WrappedPage>} />
          <Route path="/redeem" element={<WrappedPage><RedeemPoints /></WrappedPage>} />
          <Route path="/achievements" element={<WrappedPage><Achievements /></WrappedPage>} />
          <Route path="/missions" element={<WrappedPage><Missions /></WrappedPage>} />
          <Route path="/notifications" element={<WrappedPage><Notifications /></WrappedPage>} />
          <Route path="/history" element={<WrappedPage><History /></WrappedPage>} />
          <Route path="/settings" element={<WrappedPage><Settings /></WrappedPage>} />
          <Route path="/support" element={<WrappedPage><Support /></WrappedPage>} />
          <Route path="/events" element={<WrappedPage><SeasonalEvents /></WrappedPage>} />
          <Route path="/leaderboard" element={<WrappedPage><Leaderboard /></WrappedPage>} />
          <Route path="/stats" element={<WrappedPage><UserStats /></WrappedPage>} />

          {/* Admin routes (use their own layout) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/qr" element={<AdminQR />} />
          <Route path="/admin/games" element={<AdminGames />} />

          {/* Error pages */}
          <Route path="/no-connection" element={<NoConnection />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
//hi
