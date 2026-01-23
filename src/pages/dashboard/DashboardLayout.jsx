import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Activity, Users, Settings, LogOut, Bell, Menu, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const DashboardLayout = () => {
    const location = useLocation();
    const { user, login } = useAuth();
    const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dynamic Navigation based on Role
    const getNavItems = () => {
        const common = [
            { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        ];

        if (!user) return common;

        if (user.role === 'donor') {
            return [
                ...common,
                { label: 'Find Donors', path: '/dashboard/find-donor', icon: Map },
                { label: 'My Requests', path: '/dashboard/requests', icon: Activity },
                { label: 'Profile', path: '/dashboard/profile', icon: User },
            ];
        }

        if (user.role === 'hospital') {
            return [
                ...common,
                { label: 'Create Request', path: '/dashboard/requests/create', icon: Activity },
                { label: 'Inventory', path: '/dashboard/inventory', icon: Activity }, // Pending
            ];
        }

        if (user.role === 'organization') {
            return [
                ...common,
                { label: 'Camp Management', path: '/dashboard/camps', icon: Users },
                { label: 'Donor Map', path: '/dashboard/find-donor', icon: Map },
            ];
        }

        return common;
    };

    const navItems = getNavItems();

    return (
        <div className="flex h-screen bg-slate-50">

            {/* MOBILE OVERLAY */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden animate-in fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* SIDEBAR */}
            <aside className={`flex flex-col w-64 bg-white border-r border-slate-200 h-full fixed left-0 top-0 z-30 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 h-20 flex items-center border-b border-slate-100">
                    <span className="text-xl font-bold text-brand-600 flex items-center gap-2">
                        <span className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center">DL</span>
                        DonorLink
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'} // Exact match for root
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-brand-50 text-brand-700 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="pt-8 mt-8 border-t border-slate-100">
                        <div className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">System</div>
                        <NavLink to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-50">
                            <Settings size={20} /> Settings
                        </NavLink>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">

                {/* HEADER */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500"><Menu size={24} /></button>
                        <span className="font-bold text-lg text-slate-800">DonorLink</span>
                    </div>

                    <h2 className="hidden md:block text-xl font-semibold text-slate-800 capitalize">
                        {location.pathname.split('/').pop().replace('-', ' ') || 'Overview'}
                    </h2>

                    <div className="flex items-center gap-6">

                        {/* DEMO ROLE SWITCHER */}
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200"
                            >
                                Demo: {user?.role.toUpperCase()} <ChevronDown size={14} />
                            </button>
                            {isRoleMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden py-1 animate-in fade-in zoom-in-95">
                                    {['donor', 'hospital', 'organization'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => { login(r); setIsRoleMenuOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 capitalize"
                                        >
                                            Switch to {r}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <NavLink to="/dashboard/notifications" className="relative p-2 text-slate-400 hover:text-brand-600 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </NavLink>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-700">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role || 'Viewer'}</p>
                            </div>
                            <img src={user?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-brand-100 p-0.5" />
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;