import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Phone, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const FindDonor = () => {
    const { addToast } = useToast();
    const [donors, setDonors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const fetchDonors = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            let url = 'http://127.0.0.1:8000/api/auth/donors/';

            const params = new URLSearchParams();
            if (activeFilter !== 'All') params.append('blood_group', activeFilter);
            if (searchTerm) params.append('search', searchTerm);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setDonors(data);
            } else {
                addToast("Failed to fetch donors.", "error");
            }
        } catch (error) {
            addToast("Network error while finding donors.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchDonors();
        }, 500); // Wait for user to stop typing

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, activeFilter]);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">

            {/* LEFT PANEL: Search & List */}
            <div className="w-full lg:w-[450px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Search Header */}
                <div className="p-5 border-b border-slate-100 space-y-4 bg-white z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by location or email..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                        {['All', 'O+', 'A+', 'B+', 'AB+', 'O-', 'Emergency'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all whitespace-nowrap ${filter === activeFilter ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Results ({donors.length})</h3>

                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                        </div>
                    ) : donors.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            No donors found matching criteria.
                        </div>
                    ) : (
                        donors.map((donor) => (
                            <div key={donor.id} className="group p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer bg-white">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="relative shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${donor.name}&background=random`} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${donor.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{donor.name}</h4>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <MapPin size={12} /> {donor.location} • {donor.dist}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded text-xs font-bold">{donor.type}</span>
                                        <span className="flex items-center gap-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium whitespace-nowrap">
                                            <ShieldCheck size={10} className="text-brand-600" /> Trust: {donor.trust}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Actions (Visible on Hover) */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                                        Ping Request
                                    </button>
                                    <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                                        <Phone size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: Map Visualization */}
            <div className="hidden lg:flex flex-1 bg-slate-200 rounded-2xl border border-slate-300 relative overflow-hidden">
                {/* Placeholder Map Background */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.42,37.78,13,0,0/1000x800?access_token=placeholder')] bg-cover opacity-60 grayscale-[20%]"></div>

                {/* Custom Map Grids */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Map Pins (Simulated) */}
                {donors.map((donor, index) => (
                    <div
                        key={donor.id}
                        className="absolute cursor-pointer hover:scale-110 transition-transform group"
                        style={{ top: `${30 + ((index % 5) * 12)}%`, left: `${40 + ((index % 6) * 8)}%` }} // Pseudo-random positions
                    >
                        <div className="relative flex flex-col items-center">
                            <div className="px-2 py-1 bg-white rounded shadow-md text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {donor.name} ({donor.type})
                            </div>
                            <div className="w-8 h-8 bg-brand-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs animate-bounce" style={{ animationDelay: `${(index % 3) * 0.2}s` }}>
                                {donor.type}
                            </div>
                            <div className="w-2 h-2 bg-brand-600 rounded-full mt-1 opacity-50 blur-[2px]"></div>
                        </div>
                    </div>
                ))}

                {/* Map Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                    <button className="p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50"><MapPin size={20} className="text-slate-600" /></button>
                    <button className="p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50"><Filter size={20} className="text-slate-600" /></button>
                </div>
            </div>

        </div>
    );
};

export default FindDonor;