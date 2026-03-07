import { useState, useEffect } from 'react';
import { Activity, Droplet, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';

const HospitalHome = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total_requests: 0,
        fulfilled_requests: 0,
        critical_requests: 0,
        active_donors: 0
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
                addToast("Failed to load hospital analytics.", "error");
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
                    <h1 className="text-2xl font-bold text-slate-900">Hospital Command Center</h1>
                    <p className="text-slate-500">Live overview of your emergency broadcasts and fulfillment rates.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/requests/create')}>
                    <Activity size={18} className="mr-2" /> Broadcast Emergency
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Activity size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.total_requests}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfilled</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.fulfilled_requests}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.critical_requests}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Droplet size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Network Donors</span>
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.active_donors}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-lg flex flex-col justify-center">
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
                    <h3 className="text-xl font-bold mb-2">Need to check blood stock?</h3>
                    <p className="text-slate-400 mb-6 max-w-sm">Manage your A+, O-, and other critical blood units in the real-time inventory system.</p>
                    <Button variant="secondary" onClick={() => navigate('/dashboard/inventory')} className="w-fit">
                        Manage Inventory <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Track Active Emergencies</h3>
                    <p className="text-slate-500 mb-6 max-w-sm">View matches and monitor donors who are currently navigating to your facility.</p>
                    <Button variant="outline" onClick={() => navigate('/dashboard/requests')} className="w-fit">
                        View Request Log <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HospitalHome;