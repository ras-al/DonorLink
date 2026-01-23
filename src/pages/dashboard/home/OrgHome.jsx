
import { Map, Users, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import Button from '../../../components/common/Button';

const OrgHome = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* WELCOME SECTION */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Red Cross Chapter</h1>
                    <p className="text-slate-500">Campaign Planning & Donor Outreach</p>
                </div>
                <Button>Organize New Camp</Button>
            </div>

            {/* AI PREDICTION CARD */}
            <div className="bg-gradient-to-r from-brand-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="flex items-center gap-2 text-brand-200 font-bold uppercase text-xs tracking-wider mb-2">
                            <TrendingUp size={16} /> AI Insight
                        </div>
                        <h2 className="text-3xl font-bold mb-4">High Donor Availability Detected</h2>
                        <p className="text-brand-100 mb-6 max-w-md">
                            Our models predict a <span className="text-white font-bold">150+ turnout</span> if you host a camp in
                            <span className="text-white font-bold decoration-slice"> West Andheri</span> on <span className="text-white font-bold">Feb 12th</span>.
                        </p>
                        <Button variant="secondary">Plan this Camp</Button>
                    </div>
                    <div className="hidden lg:flex justify-end">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-64">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-brand-200 text-sm">Predicted</span>
                                <span className="text-2xl font-bold">152</span>
                            </div>
                            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-400 w-[85%] h-full"></div>
                            </div>
                            <p className="text-xs text-brand-300 mt-2">85% higher than avg.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* UPCOMING CAMPS */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Upcoming Camps</h3>

                    <div className="space-y-4">
                        {[
                            { name: 'Tech Park Donation Drive', loc: 'InfoPark Campus', date: 'Jan 25, 2026', confirmed: 84 },
                            { name: 'Community Center Camp', loc: 'Downtown Hall', date: 'Feb 02, 2026', confirmed: 45 },
                        ].map((camp, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex flex-col items-center justify-center">
                                        <span className="text-xs font-bold uppercase">{camp.date.split(' ')[0]}</span>
                                        <span className="text-lg font-bold">{camp.date.split(' ')[1].replace(',', '')}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{camp.name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                            <Map size={14} /> {camp.loc}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-900">{camp.confirmed}</p>
                                    <p className="text-xs text-slate-500">Donors Registered</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Analytics</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Donors Reached</span>
                                <span className="font-bold text-slate-900">1,204</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-brand-600 w-[65%] h-full"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Avg. Turnout Rate</span>
                                <span className="font-bold text-slate-900">78%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-purple-600 w-[78%] h-full"></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500 mb-4">Export monthly reports for compliance.</p>
                            <Button variant="outline" className="w-full">Download Report</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default OrgHome;
