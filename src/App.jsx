import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/public/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import FindDonor from './pages/dashboard/FindDonor';
import CreateRequest from './pages/dashboard/CreateRequest';
import { AuthProvider } from './context/AuthContext';
import DashboardHome from './pages/dashboard/DashboardHome';
import CampManagement from './pages/dashboard/camps/CampManagement';
import UserProfile from './pages/dashboard/profile/UserProfile';
import Notifications from './pages/dashboard/Notifications';
import Settings from './pages/dashboard/Settings';
import Inventory from './pages/dashboard/Inventory';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div key={location.pathname} className="animate-in fade-in zoom-in-95 duration-500">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="find-donor" element={<FindDonor />} />
            <Route path="requests" element={<div className="p-10">Request History (Coming Soon)</div>} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="camps" element={<CampManagement />} />
            <Route path="requests/create" element={<CreateRequest />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}



export default App;