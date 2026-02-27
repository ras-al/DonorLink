import { useState } from 'react';
import { Calendar, MapPin, Users, TrendingUp, Plus, Activity, Clock } from 'lucide-react';
import Button from '../../../components/common/Button';

const CampManagement = () => {
    // Mock Data
    const activeCamps = [
        { id: 1, name: "TKM College Annual Drive", date: "Feb 26, 2026", location: "Kollam Campus", expected: 150, registered: 84, status: "Upcoming" },
        { id: 2, name: "City Center Blood Drive", date: "Mar 10, 2026", location: "City Mall Arcade", expected: 300, registered: 45, status: "Planning" }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Camp Management</h1>
                    <p className="text-slate-500">Plan drives and predict donor turnout using AI.</p>
                </div>
                <Button className="h-10"><Plus size={18} /> Organize Camp</Button>
            </div>

            {/* Top AI Stats Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl text-white shadow-lg shadow-brand-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <h3 className="text-brand-100 font-medium text-sm mb-4">AI Turnout Prediction</h3>
                    <div className="flex items-end gap-3 mb-2">
                        <span className="text-4xl font-bold">85%</span>
                        <span className="text-brand-200 mb-1 flex items-center gap-1"><TrendingUp size={16} /> High Accuracy</span>
                    </div>
                    <p className="text-sm text-brand-100/80">Model predicts optimal turnout on weekends between 10 AM - 2 PM.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                        <h3 className="text-slate-500 font-medium text-sm">Total Reach Potential</h3>
                    </div>
                    <span className="text-3xl font-bold text-slate-900 mt-2">12,450</span>
                    <p className="text-xs text-green-600 mt-2 font-medium">+12% from last month in your region</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Activity size={20} /></div>
                        <h3 className="text-slate-500 font-medium text-sm">Shortage Alerts</h3>
                    </div>
                    <span className="text-3xl font-bold text-slate-900 mt-2">O+, AB-</span>
                    <p className="text-xs text-amber-600 mt-2 font-medium">Target these groups for upcoming drives</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Active Camps List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Your Campaigns</h2>

                    {activeCamps.map(camp => (
                        <div key={camp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-200 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">{camp.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {camp.date}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {camp.location}</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100">
                                    {camp.status}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex-1 max-w-xs">
                                    <div className="flex justify-between text-xs mb-1 font-medium">
                                        <span className="text-slate-500">Registrations</span>
                                        <span className="text-slate-900">{camp.registered} / {camp.expected} (AI Target)</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(camp.registered / camp.expected) * 100}%` }}></div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="ml-4">Manage</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: AI Drive Planner Tool */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden flex flex-col h-full">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.42,37.78,12,0,0/600x600?access_token=placeholder')] bg-cover opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-brand-400 mb-6">
                            <Activity className="animate-pulse" size={20} />
                            <span className="font-bold uppercase tracking-wider text-xs">AI Heatmap Engine</span>
                        </div>

                        <h3 className="text-xl font-bold mb-2">Where to host next?</h3>
                        <p className="text-slate-400 text-sm mb-6">Our AI constantly analyzes donor density and hospital shortages to recommend camp locations.</p>

                        <div className="space-y-3 mt-auto">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-white">Technopark Area</span>
                                    <span className="text-green-400 text-xs font-bold">92% Match</span>
                                </div>
                                <p className="text-xs text-slate-300">High density of eligible young donors. Low recent activity.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-white">Railway Station East</span>
                                    <span className="text-green-400 text-xs font-bold">88% Match</span>
                                </div>
                                <p className="text-xs text-slate-400">High foot traffic, suitable for weekend mobile drives.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CampManagement;