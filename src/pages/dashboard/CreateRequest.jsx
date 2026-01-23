import { useState } from 'react';
import { Activity, AlertCircle, Clock, CheckCircle2, Search, MapPin, ChevronRight, User } from 'lucide-react';
import Button from '../../components/common/Button';

const CreateRequest = () => {
    const [step, setStep] = useState(1);
    const [urgency, setUrgency] = useState('medium');
    const [isSearching, setIsSearching] = useState(false);

    // Mock AI Matching State
    const handleSearch = () => {
        setStep(3);
        setIsSearching(true);
        // Simulate AI processing time
        setTimeout(() => setIsSearching(false), 3000);
    };

    return (
        <div className="max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Create Blood Request</h1>
                    <p className="text-slate-500">AI-Powered matching will prioritize donors based on urgency.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-bold border border-red-100">
                    <Activity size={18} className="animate-pulse" /> Emergency Mode Active
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Main Form Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Step Indicator */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 font-bold ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>1</span>
                            Patient
                        </div>
                        <div className="w-12 h-1 bg-slate-200">
                            <div className={`h-full bg-brand-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className={`flex items-center gap-2 font-bold ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>2</span>
                            Details
                        </div>
                        <div className="w-12 h-1 bg-slate-200">
                            <div className={`h-full bg-brand-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className={`flex items-center gap-2 font-bold ${step >= 3 ? 'text-brand-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>3</span>
                            AI Match
                        </div>
                    </div>

                    {/* STEP 1: Patient Details */}
                    {step === 1 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <User size={20} className="text-brand-600" /> Patient Information
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Patient Name</label>
                                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Age</label>
                                    <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="e.g. 34" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Hospital Admission ID</label>
                                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="e.g. HOSP-2026-889" />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button onClick={() => setStep(2)}>Next Step <ChevronRight size={18} /></Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Blood Requirements */}
                    {step === 2 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-brand-600" /> Blood Requirements
                            </h3>

                            {/* Urgency Selector */}
                            <div className="mb-8">
                                <label className="text-sm font-medium text-slate-700 mb-3 block">Urgency Level</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setUrgency('low')}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === 'low' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        Low
                                        <span className="block text-xs font-normal mt-1 text-slate-500">Scheduled Surgery</span>
                                    </button>
                                    <button
                                        onClick={() => setUrgency('medium')}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        Medium
                                        <span className="block text-xs font-normal mt-1 text-slate-500">Within 24 Hours</span>
                                    </button>
                                    <button
                                        onClick={() => setUrgency('critical')}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === 'critical' ? 'border-red-600 bg-red-50 text-red-700 font-bold ring-2 ring-red-500/20' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <span className="flex items-center justify-center gap-2">CRITICAL <AlertCircle size={16} /></span>
                                        <span className="block text-xs font-normal mt-1 text-slate-500">Immediate Action</span>
                                    </button>
                                </div>
                            </div>

                            {/* Blood Group Grid */}
                            <div className="mb-8">
                                <label className="text-sm font-medium text-slate-700 mb-3 block">Required Blood Group</label>
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <button key={bg} className="aspect-square rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 font-bold text-slate-700 focus:bg-brand-600 focus:text-white transition-all">
                                            {bg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={handleSearch} variant={urgency === 'critical' ? 'primary' : 'primary'}>
                                    {urgency === 'critical' ? 'Broadcast Emergency' : 'Find Donors'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: AI Processing Visualization */}
                    {step === 3 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4 relative overflow-hidden">
                            {isSearching ? (
                                <div className="text-center py-12 space-y-6">
                                    <div className="relative inline-block">
                                        <div className="w-24 h-24 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Search className="text-brand-600 animate-pulse" size={32} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">AI is Analyzing Donor Database</h3>
                                        <p className="text-slate-500 mt-2">Filtering by Location, Trust Score, and Last Donation Date...</p>
                                    </div>
                                    <div className="max-w-md mx-auto space-y-2">
                                        <div className="flex justify-between text-xs text-slate-400 uppercase font-bold">
                                            <span>Scanning Radius</span>
                                            <span>5km / 10km</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-500 w-2/3 animate-[pulse_1s_ease-in-out_infinite]"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">8 Donors Identified</h3>
                                    <p className="text-slate-500 mt-2 mb-8">Alerts have been queued for the top matches.</p>

                                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-left mb-6">
                                        <div className="px-4 py-3 border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-500 uppercase">Top 3 AI Matches</div>
                                        {[
                                            { name: 'Nitin Mahajan', dist: '0.8km', score: 98 },
                                            { name: 'Ankita Biswas', dist: '1.2km', score: 95 },
                                            { name: 'Rahul Nair', dist: '2.5km', score: 92 }
                                        ].map((d, i) => (
                                            <div key={i} className="px-4 py-3 border-b border-slate-100 flex justify-between items-center last:border-0">
                                                <div>
                                                    <p className="font-bold text-slate-800">{d.name}</p>
                                                    <p className="text-xs text-slate-500">{d.dist} away</p>
                                                </div>
                                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                                                    {d.score}% Match
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>Monitor Responses</Button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* RIGHT: Live Stats Widget */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Inventory Status</h4>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-bold">A+</span>
                            <span className="text-red-400 font-bold mb-1 text-sm">Low Stock</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 w-[20%] h-full"></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Only 2 units remaining in cold storage.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4">AI Prediction</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Clock size={18} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Est. Fulfillment Time</p>
                                    <p className="font-bold text-slate-800">18 - 25 Mins</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><MapPin size={18} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Donor Availability</p>
                                    <p className="font-bold text-slate-800">High (12 Active)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateRequest;