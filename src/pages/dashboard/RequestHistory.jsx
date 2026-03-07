import { useState, useEffect, useRef } from 'react';
import { Search, Activity, Clock, CheckCircle2, AlertCircle, UserX, ChevronDown, Plus, XCircle, Hourglass } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { value: 'matching', label: 'Matching', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { value: 'fulfilled', label: 'Fulfilled', color: 'text-green-600 bg-green-50 border-green-200' },
    { value: 'expired', label: 'Expired', color: 'text-slate-500 bg-slate-50 border-slate-200' },
];

const StatusBadge = ({ status }) => {
    const opt = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
    const Icon = status === 'fulfilled' ? CheckCircle2 : status === 'expired' ? XCircle : status === 'matching' ? Activity : Hourglass;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${opt.color}`}>
            <Icon size={12} className={status === 'matching' ? 'animate-pulse' : ''} />
            {opt.label}
        </span>
    );
};

const StatusDropdown = ({ requestId, currentStatus, onStatusChange }) => {
    const [open, setOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const ref = useRef(null);
    const { addToast } = useToast();

    useEffect(() => {
        const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = async (newStatus) => {
        if (newStatus === currentStatus) { setOpen(false); return; }
        setUpdating(true);
        setOpen(false);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://127.0.0.1:8000/api/blood/requests/${requestId}/update_status/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (res.ok) {
                addToast(`Status updated to "${newStatus}"`, 'success');
                onStatusChange(requestId, newStatus);
            } else {
                addToast(data.detail || 'Failed to update status.', 'error');
            }
        } catch {
            addToast('Server error.', 'error');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(v => !v)}
                disabled={updating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors shadow-sm"
            >
                {updating ? <span className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /> : <StatusBadge status={currentStatus} />}
                <ChevronDown size={13} className={`ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {STATUS_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors ${currentStatus === opt.value ? 'bg-brand-50 text-brand-600' : 'text-slate-700'}`}
                        >
                            <StatusBadge status={opt.value} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const RequestHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reportingId, setReportingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            const response = await fetch('http://127.0.0.1:8000/api/blood/requests/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch {
            addToast("Network error. Could not load requests.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleStatusChange = (requestId, newStatus) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const handleNoShow = async (requestId) => {
        if (!window.confirm("Are you sure? This will heavily penalize the donor's Trust Score and reopen the request.")) return;
        setReportingId(requestId);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/blood/requests/${requestId}/report_noshow/`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                addToast("Donor penalized. Request re-opened for new matches.", "success");
                fetchRequests();
            } else {
                addToast(data.detail || "Failed to report no-show.", "error");
            }
        } catch {
            addToast("Server error.", "error");
        } finally {
            setReportingId(null);
        }
    };

    const filteredRequests = requests.filter(r => {
        const inTab = activeTab === 'active'
            ? ['pending', 'matching', 'fulfilled'].includes(r.status)
            : r.status === 'expired';
        const inSearch = !searchTerm ||
            (r.patient_name && r.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            r.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(r.id).includes(searchTerm);
        return inTab && inSearch;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Request Tracking</h1>
                    <p className="text-slate-500">Monitor emergencies, update statuses, and report donor attendance.</p>
                </div>
                {user?.role === 'hospital' && (
                    <button
                        onClick={() => navigate('/dashboard/requests/create')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                        <Plus size={18} /> New Request
                    </button>
                )}
            </div>

            {/* Tabs + Search bar */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between gap-3 shadow-sm">
                <div className="flex bg-slate-50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'active' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active / Pending
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-brand-100 text-brand-600 rounded-full">
                            {requests.filter(r => ['pending', 'matching', 'fulfilled'].includes(r.status)).length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'past' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Past Log
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-200 text-slate-500 rounded-full">
                            {requests.filter(r => r.status === 'expired').length}
                        </span>
                    </button>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input
                        type="text"
                        placeholder="Search patient, blood group, ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                    />
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700">No {activeTab} requests found.</h3>
                            {user?.role === 'hospital' && activeTab === 'active' && (
                                <button
                                    onClick={() => navigate('/dashboard/requests/create')}
                                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
                                >
                                    <Plus size={16} /> Create your first request
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredRequests.map(req => (
                            <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-5 hover:border-brand-200 transition-colors">
                                {/* Blood Group Avatar */}
                                <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center font-black text-xl shadow-inner ${req.urgency_level === 'critical' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
                                    {req.blood_group}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-slate-800">{req.patient_name}</h3>
                                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">REQ-{req.id}</span>
                                        {req.urgency_level === 'critical' && (
                                            <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full uppercase">Critical</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTime(req.created_at)}</span>
                                        {req.location && <span className="text-slate-400">📍 {req.location}</span>}
                                    </div>
                                </div>

                                {/* Status + Actions */}
                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Status change dropdown (hospitals only) */}
                                    {user?.role === 'hospital' ? (
                                        <StatusDropdown
                                            requestId={req.id}
                                            currentStatus={req.status}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ) : (
                                        <StatusBadge status={req.status} />
                                    )}

                                    {/* Report No-Show (only when fulfilled) */}
                                    {user?.role === 'hospital' && req.status === 'fulfilled' && (
                                        <button
                                            onClick={() => handleNoShow(req.id)}
                                            disabled={reportingId === req.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            {reportingId === req.id
                                                ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                : <UserX size={13} />
                                            }
                                            No-Show
                                        </button>
                                    )}
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