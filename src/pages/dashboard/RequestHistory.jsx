import { useState } from 'react';
import { Search, Filter, Activity, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const RequestHistory = () => {
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'

    // Mock Data
    const requests = [
        { id: 'REQ-892', patient: 'Sarah Connor', bg: 'O+', location: 'General Hospital', urgency: 'Critical', status: 'Matching', time: '10 mins ago', aiMatches: 4 },
        { id: 'REQ-891', patient: 'John Doe', bg: 'A-', location: 'City Clinic', urgency: 'Medium', status: 'Fulfilled', time: '2 hrs ago', aiMatches: 12 },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Request Tracking</h1>
                    <p className="text-slate-500">Monitor active emergencies and past fulfilled requests.</p>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4 shadow-sm">
                <div className="flex bg-slate-50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'active' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active / Pending
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'past' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Past Log
                    </button>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search requests..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <Button variant="outline" className="px-3"><Filter size={18} /></Button>
                </div>
            </div>

            {/* List of Requests */}
            <div className="space-y-4">
                {requests.filter(r => activeTab === 'active' ? r.status === 'Matching' : r.status === 'Fulfilled').map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-200 transition-colors group">

                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner ${req.urgency === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-50 text-brand-600 border border-brand-100'}`}>
                                {req.bg}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg text-slate-800">{req.patient}</h3>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{req.id}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {req.location}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={16} /> {req.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                            <div className="text-center md:text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Matching</p>
                                {req.status === 'Matching' ? (
                                    <p className="font-bold text-amber-600 flex items-center gap-1.5"><Activity size={16} className="animate-pulse" /> {req.aiMatches} Donors Notified</p>
                                ) : (
                                    <p className="font-bold text-green-600 flex items-center gap-1.5"><CheckCircle2 size={16} /> Fulfilled</p>
                                )}
                            </div>

                            <Button variant={req.status === 'Matching' ? 'primary' : 'secondary'} className="w-full md:w-auto">
                                {req.status === 'Matching' ? 'View Details' : 'View Report'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequestHistory;