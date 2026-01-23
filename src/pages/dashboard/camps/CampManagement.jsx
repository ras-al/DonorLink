
import { useState } from 'react';
import { Map, Calendar, Users, Plus, TrendingUp, MapPin, Search } from 'lucide-react';
import Button from '../../../components/common/Button';

const CampManagement = () => {
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'create'
    const [prediction, setPrediction] = useState(null);

    const handlePredict = () => {
        // Mock prediction
        setPrediction({
            donors: 145,
            confidence: 88,
            topGroups: ['A+', 'O+']
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Camp Management</h1>
                    <p className="text-slate-500">Plan and manage blood donation drives.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'upcoming' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                    >
                        Upcoming Camps
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'create' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}
                    >
                        Plan New Camp
                    </button>
                </div>
            </div>

            {activeTab === 'upcoming' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-brand-200 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-brand-50 text-brand-700 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                                    Upcoming
                                </div>
                                <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">Corporate Tech Park Drive</h3>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                <MapPin size={16} /> Silicon Valley, Sector 4
                            </div>

                            <div className="flex items-center justify-between text-sm py-3 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>Jan 24, 2026</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-slate-400" />
                                    <span>85 Reg.</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full mt-2">View Analytics</Button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'create' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Plus className="bg-brand-100 text-brand-600 p-1 rounded-full" size={24} />
                            Camp Details
                        </h3>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Camp Name</label>
                                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="e.g. Summer Donation Drive" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Expected Date</label>
                                    <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Location / Venue</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="Search for location..." />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button onClick={handlePredict} className={prediction ? 'bg-slate-800' : ''}>
                                    {prediction ? 'Recalculate AI Prediction' : 'Run AI Prediction'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* AI SIDE PANEL */}
                    <div className={`bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${prediction ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4 grayscale'}`}>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

                        <div className="relative z-10">
                            <h4 className="flex items-center gap-2 font-bold text-brand-300 uppercase tracking-wider text-xs mb-4">
                                <TrendingUp size={16} /> AI Forecast
                            </h4>

                            {prediction ? (
                                <div className="space-y-6 animate-in fade-in zoom-in-95">
                                    <div className="text-center">
                                        <p className="text-slate-400 text-sm">Estimated Turnout</p>
                                        <p className="text-5xl font-bold text-white mt-1">{prediction.donors}</p>
                                        <p className="text-green-400 text-xs font-bold mt-2 flex items-center justify-center gap-1">
                                            <TrendingUp size={12} /> {prediction.confidence}% Confidence Score
                                        </p>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                                        <p className="text-xs text-slate-300 mb-2">Likely Blood Groups</p>
                                        <div className="flex gap-2">
                                            {prediction.topGroups.map(g => (
                                                <span key={g} className="bg-brand-600 px-2 py-1 rounded text-xs font-bold">{g}</span>
                                            ))}
                                            <span className="text-xs text-slate-400 flex items-center">+2 others</span>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-white text-slate-900 hover:bg-brand-50">Confirm & Publish Camp</Button>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Enter camp details to generate AI turnout predictions.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampManagement;
