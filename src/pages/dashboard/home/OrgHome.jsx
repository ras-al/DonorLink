import { useState, useEffect } from 'react';
import { Calendar, Users, Activity, ArrowRight } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';

const OrgHome = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total_camps: 0,
        active_camps: 0,
        expected_turnout: 0
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
                addToast("Failed to load organization analytics.", "error");
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
                    <h1 className="text-2xl font-bold text-slate-900">Organization Dashboard</h1>
                    <p className="text-slate-500">Manage your blood donation drives and community impact.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/camps')}>
                    <Calendar size={18} className="mr-2" /> Schedule New Camp
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Calendar size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Camps</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.total_camps}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Activity size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active / Upcoming</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.active_camps}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Turnout</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.expected_turnout}</div>
                </div>
            </div>

            <div className="mt-8 bg-slate-900 text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Manage Your Community Drives</h3>
                    <p className="text-slate-400 max-w-md">Update camp details, track registered donors, and view AI-driven turnout predictions for your upcoming events.</p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/dashboard/camps')} className="shrink-0">
                    Go to Camp Manager <ArrowRight size={18} className="ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default OrgHome;