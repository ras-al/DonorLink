import { ShieldCheck, Activity, MapPin, Calendar, Award, Download, CheckCircle } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useToast } from '../../../context/ToastContext'; // Optional: if you added the toast

const UserProfile = () => {
    const { addToast } = useToast(); // If you implemented the ToastProvider earlier

    const handleDownload = (hospitalName) => {
        // In a real app, this would trigger a PDF generation
        addToast(`Downloading certificate for ${hospitalName}...`, 'success');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header Profile Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="relative">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                            O+
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900">Alex Johnson</h1>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 border border-green-200">
                                <ShieldCheck size={14} /> Verified Donor
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                            <span className="flex items-center gap-1"><MapPin size={16} /> Kollam, Kerala</span>
                            <span className="flex items-center gap-1"><Calendar size={16} /> Joined Oct 2025</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline">Edit Profile</Button>
                        <Button>Donate Now</Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT: AI Trust & Stats */}
                <div className="space-y-6">
                    {/* AI Trust Score Widget */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-slate-900/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-2xl opacity-20 -mr-10 -mt-10"></div>

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="font-bold text-slate-300 flex items-center gap-2">
                                <Activity size={18} className="text-brand-400" /> AI Trust Score
                            </h3>
                            <ShieldCheck className="text-green-400" size={24} />
                        </div>

                        <div className="flex items-end gap-3 mb-2 relative z-10">
                            <span className="text-5xl font-extrabold text-white">98<span className="text-2xl text-slate-400">%</span></span>
                            <span className="text-green-400 text-sm font-bold mb-1 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded">Excellent</span>
                        </div>

                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4 relative z-10">
                            <div className="bg-gradient-to-r from-brand-500 to-green-400 w-[98%] h-full"></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 font-medium relative z-10">Based on response rate, attendance, and health feedback.</p>
                    </div>

                    {/* Medical Eligibility */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Current Eligibility</h3>
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-green-800">Ready to Donate</h4>
                                <p className="text-xs text-green-600 font-medium mt-0.5">Last donation was 4 months ago.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Donation History with Certificates */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Donation Impact Log</h3>
                        <Button variant="ghost" size="sm">Download All Data</Button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {[
                            { id: 1, hospital: 'City Medical Center', date: 'Oct 12, 2025', type: 'Emergency', status: 'Completed', pts: '+50' },
                            { id: 2, hospital: 'TKM College Drive', date: 'Jun 05, 2025', type: 'Camp', status: 'Completed', pts: '+20' },
                            { id: 3, hospital: 'Apollo Hospital', date: 'Jan 18, 2025', type: 'Emergency', status: 'Completed', pts: '+50' },
                            { id: 4, hospital: 'General Hospital', date: 'Sep 02, 2024', type: 'Emergency', status: 'Missed', pts: '-15', missed: true },
                        ].map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-brand-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${log.missed ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-brand-50 text-brand-600 border border-brand-100'}`}>
                                        {log.type === 'Emergency' ? <Activity size={20} /> : <Award size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{log.hospital}</h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {log.date}</span>
                                            <span className="font-medium">• {log.type}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Points and Download Certificate Button */}
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <span className={`text-sm font-bold ${log.missed ? 'text-red-500' : 'text-green-600'}`}>
                                            {log.pts} Trust Pts
                                        </span>
                                        <p className={`text-xs mt-1 font-medium ${log.missed ? 'text-red-400' : 'text-slate-400'}`}>{log.status}</p>
                                    </div>

                                    {/* THE CERTIFICATE DOWNLOAD BUTTON */}
                                    {log.status === 'Completed' ? (
                                        <button
                                            onClick={() => handleDownload(log.hospital)}
                                            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-600 rounded-lg transition-colors group/btn shadow-sm"
                                            title="Download Certificate"
                                        >
                                            <Download size={16} />
                                            <span className="text-xs font-bold hidden md:block">Certificate</span>
                                        </button>
                                    ) : (
                                        <div className="px-3 py-2 w-10"></div> // Placeholder for alignment
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;