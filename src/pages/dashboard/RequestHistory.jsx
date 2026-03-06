import { useState, useEffect } from 'react';
import { Search, Filter, Activity, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const RequestHistory = () => {
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    // Fetch real data from Django API
    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                if (!token) throw new Error("No token found");

                const response = await fetch('http://127.0.0.1:8000/api/blood/requests/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
                } else {
                    addToast("Failed to fetch requests.", "error");
                }
            } catch (error) {
                console.error(error);
                addToast("Network error. Could not load requests.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [addToast]);

    // Helper function to format Django's datetime to something readable
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Filter requests based on the active tab
    const filteredRequests = requests.filter(r => {
        if (activeTab === 'active') {
            return r.status === 'pending' || r.status === 'matching';
        }
        return r.status === 'fulfilled' || r.status === 'expired';
    });

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
                        <input type="text" placeholder="Search by patient or ID..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <Button variant="outline" className="px-3"><Filter size={18} /></Button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading live requests from database...</p>
                </div>
            ) : (
                /* List of Requests */
                <div className="space-y-4">
                    {filteredRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700">No {activeTab} requests found.</h3>
                            <p className="text-slate-500 mt-1">When emergency requests are created, they will appear here.</p>
                        </div>
                    ) : (
                        filteredRequests.map(req => (
                            <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-200 transition-colors group">

                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner ${req.urgency_level === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-50 text-brand-600 border border-brand-100'}`}>
                                        {req.blood_group}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg text-slate-800">{req.patient_name}</h3>
                                            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">REQ-{req.id}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5"><MapPin size={16} /> {req.hospital_name}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={16} /> {formatTime(req.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                    <div className="text-center md:text-right hidden sm:block">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                        {req.status === 'pending' || req.status === 'matching' ? (
                                            <p className="font-bold text-amber-600 flex items-center gap-1.5 capitalize"><Activity size={16} className="animate-pulse" /> {req.status}</p>
                                        ) : (
                                            <p className="font-bold text-green-600 flex items-center gap-1.5 capitalize"><CheckCircle2 size={16} /> {req.status}</p>
                                        )}
                                    </div>

                                    <Button variant={req.status === 'pending' || req.status === 'matching' ? 'primary' : 'secondary'} className="w-full md:w-auto">
                                        {req.status === 'pending' || req.status === 'matching' ? 'View Matches' : 'View Report'}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default RequestHistory;