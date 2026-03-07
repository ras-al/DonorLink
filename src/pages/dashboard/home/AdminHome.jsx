import { useState, useEffect } from 'react';
import { Users, AlertTriangle, ShieldAlert, Activity, ArrowRight, Ban } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';

const AdminHome = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total_users: 0,
        total_requests: 0,
        active_penalties: 0,
        blacklisted_users: 0
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blood/analytics/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                addToast("Failed to load admin analytics.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Audit Dashboard</h1>
                    <p className="text-slate-500">Global overview of network health, AI trust scores, and flagged accounts.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/dashboard/audit')}>
                    <ShieldAlert size={18} className="mr-2" /> View Audit Logs
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.total_users}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Activity size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Global Requests</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.total_requests}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Active Penalties</span>
                    </div>
                    <div className="text-4xl font-black text-red-600">{stats.active_penalties}</div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-bl-full blur-xl"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2 bg-white/10 text-white rounded-lg"><Ban size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blacklisted</span>
                    </div>
                    <div className="text-4xl font-black text-white relative z-10">{stats.blacklisted_users}</div>
                </div>
            </div>

            <div className="mt-8 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">AI Trust Score Monitoring</h3>
                    <p className="text-slate-500 max-w-xl">
                        The automated system flags users who repeatedly cancel accepted requests or fail to show up.
                        Review flagged accounts and manually adjust trust scores or issue permanent bans.
                    </p>
                </div>
                <Button onClick={() => navigate('/dashboard/users')} className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white">
                    Manage Users <ArrowRight size={18} className="ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default AdminHome;
