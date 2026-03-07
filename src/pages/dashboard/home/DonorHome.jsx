import { useState, useEffect } from 'react';
import { Activity, Clock, MapPin, Shield, Heart, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const DonorHome = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [emergencies, setEmergencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState(null);

    // Fetch live emergencies from Django
    const fetchEmergencies = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blood/requests/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEmergencies(data);
            }
        } catch (error) {
            addToast("Failed to fetch emergencies.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencies();
    }, []);

    // Handle accepting an emergency
    const handleAcceptRequest = async (requestId) => {
        setAcceptingId(requestId);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blood/requests/${requestId}/accept/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                addToast("You are a hero! Request accepted.", "success");
                fetchEmergencies(); // Refresh the list to remove the fulfilled request
            } else {
                addToast(data.detail || "Failed to accept request.", "error");
            }
        } catch (error) {
            addToast("Network error.", "error");
        } finally {
            setAcceptingId(null);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header & Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name || 'Hero'}! 👋</h1>
                    <p className="text-slate-500">Your AI-matched emergency alerts are listed below.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Live Emergencies (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={20} className="text-brand-600" /> Active AI Matches Near You
                    </h3>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                        </div>
                    ) : emergencies.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-3" />
                            <h3 className="text-lg font-bold text-slate-700">No active emergencies</h3>
                            <p className="text-slate-500 mt-1">There are currently no active requests matching your profile.</p>
                        </div>
                    ) : (
                        emergencies.map(req => (
                            <div key={req.id} className={`bg-white p-6 rounded-2xl border ${req.urgency_level === 'critical' ? 'border-red-200 shadow-md shadow-red-50' : 'border-slate-200 shadow-sm'} relative overflow-hidden group`}>

                                {req.urgency_level === 'critical' && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1 animate-pulse">
                                        CRITICAL
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl shadow-inner shrink-0 ${req.urgency_level === 'critical' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
                                            {req.blood_group}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{req.patient_name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1 font-medium">
                                                <span className="flex items-center gap-1.5"><MapPin size={16} /> {req.hospital_name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-auto">
                                        <Button
                                            onClick={() => handleAcceptRequest(req.id)}
                                            isLoading={acceptingId === req.id}
                                            variant={req.urgency_level === 'critical' ? 'primary' : 'secondary'}
                                            className="w-full"
                                        >
                                            Accept & Navigate <ArrowRight size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT: Stats & Badges (1/3 width) */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-30"></div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Shield size={20} className="text-brand-400" /> Trust Score</h3>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black">{user?.trust_score || 0}</span>
                            <span className="text-brand-200 mb-1 font-medium">/ 100</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed">Your high score means you are prioritized by our AI for critical matches.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Award size={20} className="text-brand-600" /> Impact Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Heart size={16} className="text-red-500" /> Total Donations</span>
                                <span className="font-bold text-slate-900">{user?.donations_count || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Clock size={16} className="text-brand-500" /> Last Donated</span>
                                <span className="font-bold text-slate-900 text-sm">Recently</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DonorHome;