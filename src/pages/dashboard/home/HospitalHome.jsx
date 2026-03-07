import { useState, useEffect } from 'react';
import { Activity, Droplet, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const HospitalHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_requests: 0,
        fulfilled_requests: 0,
        critical_requests: 0,
        active_donors: 0
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/blood/analytics/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        };
        fetchAnalytics();
    }, []);

    // ... (keep the rest of the existing chart/inventory code below)

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hospital Command Center</h1>
                    <p className="text-slate-500">Monitor blood inventory and manage emergency requests.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/requests/create')} className="w-full md:w-auto">
                    <Activity size={18} className="mr-2" /> Broadcast Emergency
                </Button>
            </div>

            {/* LIVE Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Activity size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Requests</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{stats.total_requests}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Fulfilled</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{stats.fulfilled_requests}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Critical Needs</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{stats.critical_requests}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Droplet size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Local Donors</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{stats.active_donors}</div>
                </div>
            </div>

            {/* The rest of your existing return statement UI goes here... */}
        </div>
    );
};

export default HospitalHome;