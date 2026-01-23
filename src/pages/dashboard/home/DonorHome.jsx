
import { Activity, Calendar, Droplet, MapPin, Award, ArrowRight } from 'lucide-react';
import Button from '../../../components/common/Button';

const DonorHome = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* WELCOME SECTION */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome back, Alex! 👋</h1>
                    <p className="text-slate-500">You are eligible to donate. There are 3 emergency requests nearby.</p>
                </div>
                <Button>Find Donation Camps</Button>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <Droplet size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Lives Saved</p>
                        <p className="text-2xl font-bold text-slate-900">12</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Donations</p>
                        <p className="text-2xl font-bold text-slate-900">4</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Trust Score</p>
                        <p className="text-2xl font-bold text-slate-900">98%</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Last Donation</p>
                        <p className="text-xl font-bold text-slate-900">3 Months ago</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* EMERGENCY REQUESTS */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Emergency Requests Nearby</h3>

                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-200 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">A+</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Urgent: Car Accident Victim</h4>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <MapPin size={14} /> City General Hospital (2.5km) • <span className="text-red-600 font-bold">Critical</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">Posted 10m ago</span>
                                </div>
                                <div className="flex gap-3">
                                    <Button size="sm" className="w-full">Accept & Navigate</Button>
                                    <Button size="sm" variant="outline" className="w-full">View Details</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UPCOMING CAMPS */}
                <div>
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Recommended Camps</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="relative h-40 bg-slate-100 rounded-xl overflow-hidden mb-4">
                            {/* Map Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                                Map View
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4 items-start pb-4 border-b border-slate-100">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg text-center min-w-[3.5rem]">
                                    <p className="text-xs font-bold uppercase">JAN</p>
                                    <p className="text-xl font-bold">25</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">Tech Park Donation Drive</h4>
                                    <p className="text-xs text-slate-500 mt-1">InfoPark Campus • 09:00 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-slate-50 text-slate-600 rounded-lg text-center min-w-[3.5rem]">
                                    <p className="text-xs font-bold uppercase">FEB</p>
                                    <p className="text-xl font-bold">02</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">Rotary Club Camp</h4>
                                    <p className="text-xs text-slate-500 mt-1">Town Hall • 10:00 AM</p>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full mt-4">View All Camps <ArrowRight size={16} /></Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DonorHome;
