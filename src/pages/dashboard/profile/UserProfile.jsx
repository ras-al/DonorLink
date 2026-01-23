
import { User, Mail, Phone, MapPin, Edit2, Award, Heart, Droplet, Share2, Calendar } from 'lucide-react';
import Button from '../../../components/common/Button';

const UserProfile = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* HEADER CARD */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-32 h-32 rounded-full border-4 border-white shadow-lg" alt="Profile" />
                        <button className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
                            <Edit2 size={16} />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">Alex Johnson</h1>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Award size={12} /> Top Donor
                            </span>
                        </div>
                        <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mb-4">
                            <MapPin size={16} /> Mumbai, Maharashtra
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                                <Droplet size={14} className="text-red-500" /> Blood Group: <span className="font-bold text-slate-900">O+</span>
                            </span>
                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                                <Heart size={14} className="text-red-500" /> Lives Saved: <span className="font-bold text-slate-900">12</span>
                            </span>
                        </div>
                    </div>

                    <div className="bg-brand-50 p-6 rounded-2xl text-center min-w-[200px]">
                        <p className="text-brand-600 font-bold mb-1">Trust Score</p>
                        <div className="text-4xl font-bold text-brand-900 mb-2">98<span className="text-lg text-brand-400">/100</span></div>
                        <div className="w-full bg-brand-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-600 w-[98%] h-full"></div>
                        </div>
                        <p className="text-xs text-brand-500 mt-2">Excellent reliability!</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: PERSONAL INFO */}
                <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Personal Details</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                            <div className="flex items-center gap-2 mt-1 font-medium text-slate-700">
                                <Mail size={16} /> alex.j@example.com
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                            <div className="flex items-center gap-2 mt-1 font-medium text-slate-700">
                                <Phone size={16} /> +91 98765 43210
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Donation</label>
                            <div className="flex items-center gap-2 mt-1 font-medium text-slate-700">
                                <Calendar size={16} /> Oct 15, 2025
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-2">Edit Profile</Button>
                    </div>

                    <h3 className="font-bold text-lg text-slate-800">Badges & Achievements</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['Life Saver', 'Speedy', 'Regular', 'Camp Star'].map((badge, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm hover:border-brand-300 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 text-lg group-hover:scale-110 transition-transform">
                                    🏆
                                </div>
                                <p className="text-xs font-bold text-slate-700">{badge}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: DONATION HISTORY */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Donation History</h3>
                        <Button variant="ghost" size="sm"><Share2 size={16} /> Share Impact</Button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-700">Date</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Location</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Type</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Certificate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { date: 'Oct 15, 2025', loc: 'City General Hospital', type: 'Emergency', cert: '#CERT-889' },
                                    { date: 'Jun 10, 2025', loc: 'Tech Park Camp', type: 'Camp Drive', cert: '#CERT-542' },
                                    { date: 'Jan 05, 2025', loc: 'Apollo Clinc', type: 'Voluntary', cert: '#CERT-112' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{row.date}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.loc}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${row.type === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 border-t border-slate-100 text-center">
                            <button className="text-slate-500 text-sm font-medium hover:text-slate-900">View All History</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default UserProfile;
