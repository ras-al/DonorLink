
import { Activity, Plus, AlertTriangle, Users } from 'lucide-react';
import Button from '../../../components/common/Button';

const HospitalHome = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* WELCOME SECTION */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">City General Hospital</h1>
                    <p className="text-slate-500">Inventory Status: 2 Blood Groups Critical</p>
                </div>
                <Button><Plus size={18} /> Create Emergency Request</Button>
            </div>

            {/* INVENTORY ALERT */}
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-4">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-red-800">Critical Shortage: O- and AB-</h3>
                    <p className="text-sm text-red-600 mt-1">
                        Current stock is below safety levels. AI predicts a surge in demand this weekend.
                        <a href="#" className="font-bold underline ml-1">View Prediction</a>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ACTIVE REQUESTS */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Active Emergency Requests</h3>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-700">Patient / ID</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Blood Group</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Urgency</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                                    <th className="px-6 py-4 font-bold text-slate-700 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { id: '#REQ-2024-001', name: 'John Doe', bg: 'A+', urgency: 'Critical', status: 'Matching' },
                                    { id: '#REQ-2024-002', name: 'Sarah Smith', bg: 'O-', urgency: 'Medium', status: 'Donors Found' },
                                    { id: '#REQ-2024-003', name: 'Mike Ross', bg: 'B+', urgency: 'Low', status: 'Scheduled' },
                                ].map((req, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{req.name}</p>
                                            <p className="text-xs text-slate-500">{req.id}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">{req.bg}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${req.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                                                    req.urgency === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {req.urgency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{req.status}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-brand-600 font-bold hover:underline">Manage</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* QUICK STATS */}
                <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Live Inventory</h3>
                    <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

                        <div className="grid grid-cols-2 gap-4">
                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                <div key={bg} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700">
                                    <span className="font-bold">{bg}</span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${['O-', 'AB-'].includes(bg) ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {['O-', 'AB-'].includes(bg) ? 'Low' : 'OK'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Users size={18} className="text-brand-600" /> Recent Donors
                        </h4>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 5}`} className="w-8 h-8 rounded-full" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">Volunteer Name</p>
                                        <p className="text-xs text-slate-500">Donated 2h ago</p>
                                    </div>
                                    <span className="text-xs font-bold text-green-600">Verified</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HospitalHome;
