import { useState, useEffect, useCallback } from 'react';
import {
    Search, Users, Building2, Tent, Activity, Heart, CheckCircle2, XCircle,
    Clock, MapPin, Phone, Mail, Droplets, ShieldCheck, AlertTriangle, Filter
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const TABS = [
    { id: 'donors', label: 'Donors', icon: Heart },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'campaigns', label: 'Active Campaigns', icon: Activity },
    { id: 'camps', label: 'Blood Camps', icon: Tent },
];

const URGENCY_COLOR = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    normal: 'bg-green-100 text-green-700',
};

const STATUS_COLOR = {
    pending: 'bg-amber-100 text-amber-700',
    matching: 'bg-blue-100 text-blue-700',
    fulfilled: 'bg-green-100 text-green-700',
    upcoming: 'bg-amber-100 text-amber-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-slate-100 text-slate-600',
};

const AdminOverview = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('donors');
    const [data, setData] = useState({ donors: [], hospitals: [], campaigns: [], camps: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [bloodGroupFilter, setBloodGroupFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blood/admin-overview/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                addToast('Failed to load admin data.', 'error');
            }
        } catch {
            addToast('Network error.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearch('');
        setBloodGroupFilter('');
        setAvailabilityFilter('');
    };

    // --- Filtered Data ---
    const filteredDonors = data.donors.filter(d => {
        const matchSearch = !search ||
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.email.toLowerCase().includes(search.toLowerCase()) ||
            (d.address && d.address.toLowerCase().includes(search.toLowerCase()));
        const matchBG = !bloodGroupFilter || d.blood_group === bloodGroupFilter;
        const matchAvail = availabilityFilter === '' ||
            (availabilityFilter === 'available' && d.is_available) ||
            (availabilityFilter === 'unavailable' && !d.is_available);
        return matchSearch && matchBG && matchAvail;
    });

    const filteredHospitals = data.hospitals.filter(h =>
        !search ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.email.toLowerCase().includes(search.toLowerCase()) ||
        (h.address && h.address.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredCampaigns = data.campaigns.filter(c =>
        !search ||
        c.blood_group.toLowerCase().includes(search.toLowerCase()) ||
        c.hospital_name.toLowerCase().includes(search.toLowerCase()) ||
        (c.patient_name && c.patient_name.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredCamps = data.camps.filter(c =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.org_name.toLowerCase().includes(search.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(search.toLowerCase()))
    );

    const counts = {
        donors: data.donors.length,
        hospitals: data.hospitals.length,
        campaigns: data.campaigns.length,
        camps: data.camps.length,
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
                <p className="text-slate-500">Browse and filter donors, hospitals, active campaigns, and camps.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`bg-white p-5 rounded-2xl border text-left transition-all shadow-sm hover:shadow-md ${activeTab === tab.id ? 'border-brand-400 ring-2 ring-brand-100' : 'border-slate-200'}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-500'}`}>
                                <tab.icon size={18} />
                            </div>
                            <span className={`text-2xl font-black ${activeTab === tab.id ? 'text-brand-600' : 'text-slate-800'}`}>
                                {counts[tab.id]}
                            </span>
                        </div>
                        <p className={`text-sm font-semibold ${activeTab === tab.id ? 'text-brand-700' : 'text-slate-600'}`}>{tab.label}</p>
                    </button>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-slate-50"
                    />
                </div>
                {activeTab === 'donors' && (
                    <>
                        <select
                            value={bloodGroupFilter}
                            onChange={e => setBloodGroupFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-brand-500"
                        >
                            <option value="">All Blood Groups</option>
                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                        <select
                            value={availabilityFilter}
                            onChange={e => setAvailabilityFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-brand-500"
                        >
                            <option value="">All Availability</option>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </>
                )}
                <span className="text-xs text-slate-400 font-medium ml-auto">
                    {activeTab === 'donors' ? filteredDonors.length :
                        activeTab === 'hospitals' ? filteredHospitals.length :
                            activeTab === 'campaigns' ? filteredCampaigns.length :
                                filteredCamps.length} result(s)
                </span>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Loading data...</p>
                </div>
            ) : (
                <div>
                    {/* DONORS TAB */}
                    {activeTab === 'donors' && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left min-w-[750px]">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Donor</th>
                                        <th className="px-4 py-3 font-semibold">Blood</th>
                                        <th className="px-4 py-3 font-semibold">Trust Score</th>
                                        <th className="px-4 py-3 font-semibold">Availability</th>
                                        <th className="px-4 py-3 font-semibold">Location</th>
                                        <th className="px-4 py-3 font-semibold">Last Donated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredDonors.length === 0 ? (
                                        <tr><td colSpan={6} className="py-10 text-center text-slate-400">No donors found.</td></tr>
                                    ) : filteredDonors.map(d => (
                                        <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-slate-800">{d.name}</p>
                                                {d.name !== d.email && (
                                                    <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={11} /> {d.email}</p>
                                                )}
                                                {d.phone && <p className="text-xs text-slate-400 flex items-center gap-1"><Phone size={11} /> {d.phone}</p>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold text-sm border border-red-100">{d.blood_group || '—'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`font-bold text-lg ${d.trust_score >= 60 ? 'text-green-600' : d.trust_score >= 30 ? 'text-amber-600' : 'text-red-600'}`}>{d.trust_score}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {d.is_available ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                        <CheckCircle2 size={12} /> Available
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                                        <XCircle size={12} /> Unavailable
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{d.address || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-slate-500">{d.last_donation_date || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* HOSPITALS TAB */}
                    {activeTab === 'hospitals' && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left min-w-[750px]">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Hospital</th>
                                        <th className="px-4 py-3 font-semibold">Registration ID</th>
                                        <th className="px-4 py-3 font-semibold">Location</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredHospitals.length === 0 ? (
                                        <tr><td colSpan={4} className="py-10 text-center text-slate-400">No hospitals found.</td></tr>
                                    ) : filteredHospitals.map(h => (
                                        <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-slate-800">{h.name}</p>
                                                {h.name !== h.email && (
                                                    <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={11} /> {h.email}</p>
                                                )}
                                                {h.phone && <p className="text-xs text-slate-400 flex items-center gap-1"><Phone size={11} /> {h.phone}</p>}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-sm text-slate-700">{h.reg_id || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{h.address || '—'}</td>
                                            <td className="px-4 py-3">
                                                {h.is_active ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                        <ShieldCheck size={12} /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                        <AlertTriangle size={12} /> Suspended
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ACTIVE CAMPAIGNS TAB */}
                    {activeTab === 'campaigns' && (
                        <div className="space-y-3">
                            {filteredCampaigns.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">No active campaigns found.</p>
                                </div>
                            ) : filteredCampaigns.map(c => (
                                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-brand-200 transition-colors">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${c.urgency_level === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-50 text-brand-600 border border-brand-100'}`}>
                                        {c.blood_group}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-800">REQ-{c.id}</span>
                                            {c.patient_name && <span className="text-slate-600">— {c.patient_name}</span>}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${URGENCY_COLOR[c.urgency_level] || 'bg-slate-100 text-slate-600'}`}>{c.urgency_level}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${STATUS_COLOR[c.status] || 'bg-slate-100 text-slate-600'}`}>{c.status}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Building2 size={13} /> {c.hospital_name}</span>
                                            {c.location && <span className="flex items-center gap-1"><MapPin size={13} /> {c.location}</span>}
                                            <span className="flex items-center gap-1"><Clock size={13} /> {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CAMPS TAB */}
                    {activeTab === 'camps' && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Camp</th>
                                        <th className="px-4 py-3 font-semibold">Organizer</th>
                                        <th className="px-4 py-3 font-semibold">Date</th>
                                        <th className="px-4 py-3 font-semibold">Location</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Expected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCamps.length === 0 ? (
                                        <tr><td colSpan={6} className="py-10 text-center text-slate-400">No camps found.</td></tr>
                                    ) : filteredCamps.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-slate-800">{c.name}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{c.org_name}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{c.date}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{c.location || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${STATUS_COLOR[c.status] || 'bg-slate-100 text-slate-600'}`}>{c.status}</span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brand-600">{c.expected_donors}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminOverview;
