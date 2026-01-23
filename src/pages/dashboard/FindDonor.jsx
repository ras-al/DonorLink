import { Search, Filter, MapPin, Phone, Star, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';

const FindDonor = () => {
    // Mock Data
    const donors = [
        { id: 1, name: 'Nitin Mahajan', type: 'O+', dist: '0.8 km', location: 'Kollam Beach Rd', trust: 98, status: 'Active' },
        { id: 2, name: 'Sarah Thomas', type: 'A+', dist: '1.2 km', location: 'Chinnakada', trust: 95, status: 'Away' },
        { id: 3, name: 'Rahul Nair', type: 'AB-', dist: '2.5 km', location: 'Kadappakada', trust: 92, status: 'Active' },
        { id: 4, name: 'Ankita Biswas', type: 'O-', dist: '4.1 km', location: 'Ashramam', trust: 99, status: 'Active' },
        { id: 5, name: 'David John', type: 'B+', dist: '5.0 km', location: 'Thangassery', trust: 88, status: 'Active' },
    ];

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
                            placeholder="Search by location or blood group..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'O+', 'A+', 'B-', 'Emergency'].map((filter) => (
                            <button key={filter} className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${filter === 'All' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Results ({donors.length})</h3>

                    {donors.map((donor) => (
                        <div key={donor.id} className="group p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer bg-white">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={`https://i.pravatar.cc/150?u=${donor.id}`} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-100" />
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
                                    <span className="flex items-center gap-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                                        <ShieldCheck size={10} className="text-brand-600" /> Trust: {donor.trust}%
                                    </span>
                                </div>
                            </div>

                            {/* Quick Actions (Visible on Hover) */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                                    Request
                                </button>
                                <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                                    <Phone size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL: Map Visualization */}
            <div className="hidden lg:flex flex-1 bg-slate-200 rounded-2xl border border-slate-300 relative overflow-hidden">
                {/* Placeholder Map Background */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.42,37.78,13,0,0/1000x800?access_token=placeholder')] bg-cover opacity-60 grayscale-[20%]"></div>

                {/* Custom Map Grids (To make it look like a map without API) */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Map Pins (Simulated) */}
                {donors.map((donor, index) => (
                    <div
                        key={donor.id}
                        className="absolute cursor-pointer hover:scale-110 transition-transform group"
                        style={{ top: `${30 + (index * 12)}%`, left: `${40 + (index * 8)}%` }}
                    >
                        <div className="relative flex flex-col items-center">
                            <div className="px-2 py-1 bg-white rounded shadow-md text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {donor.name} ({donor.type})
                            </div>
                            <div className="w-8 h-8 bg-brand-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
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