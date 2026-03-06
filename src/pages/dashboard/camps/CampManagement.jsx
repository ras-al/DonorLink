import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Activity, Clock } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useToast } from '../../../context/ToastContext';

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: ''
    });

    const fetchCamps = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/camps/list/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCamps(data);
            }
        } catch (error) {
            addToast("Failed to fetch camps", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCamps();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateCamp = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/camps/list/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                addToast("Donation Camp created successfully!", "success");
                setFormData({ name: '', date: '', location: '' });
                fetchCamps(); // Refresh the list
            } else {
                addToast("Failed to create camp. Please check details.", "error");
            }
        } catch (error) {
            addToast("Network error. Is Django running?", "error");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Camp Management</h1>
                    <p className="text-slate-500">Organize blood drives and view AI turnout predictions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Create Camp Form */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-brand-600" /> Schedule New Camp
                    </h3>
                    <form onSubmit={handleCreateCamp} className="space-y-4">
                        <Input label="Camp Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. TKM College Annual Drive" required />

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" required />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Location Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <textarea name="location" value={formData.location} onChange={handleChange} placeholder="Full address of the venue" rows="2" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none" required></textarea>
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4" isLoading={isCreating}>Create Camp</Button>
                    </form>
                </div>

                {/* RIGHT: List of Camps */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Your Scheduled Drives</h3>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                        </div>
                    ) : camps.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No camps scheduled</h3>
                            <p className="text-slate-500 mt-1">Create your first blood drive using the form.</p>
                        </div>
                    ) : (
                        camps.map(camp => (
                            <div key={camp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-6 hover:border-brand-300 transition-colors">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-lg text-slate-900">{camp.name}</h4>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${camp.status === 'upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {camp.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 text-sm text-slate-600">
                                        <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-400" /> {camp.date}</span>
                                        <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {camp.location}</span>
                                    </div>
                                </div>

                                {/* AI Prediction Box */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center min-w-[140px] text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Activity size={12} /> AI Prediction</p>
                                    <span className="text-3xl font-black text-brand-600">{camp.expected_donors}</span>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Expected Donors</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default CampManagement;