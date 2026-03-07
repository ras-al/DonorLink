import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Activity, Clock, Edit2, Trash2, X } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useToast } from '../../../context/ToastContext';

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
            const url = editingId
                ? `http://127.0.0.1:8000/api/camps/list/${editingId}/`
                : 'http://127.0.0.1:8000/api/camps/list/';

            const method = editingId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                addToast(editingId ? "Camp updated successfully!" : "Donation Camp created successfully!", "success");
                setFormData({ name: '', date: '', location: '' });
                setEditingId(null);
                fetchCamps(); // Refresh the list
            } else {
                addToast("Failed to save camp. Please check details.", "error");
            }
        } catch (error) {
            addToast("Network error. Is Django running?", "error");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditClick = (camp) => {
        setEditingId(camp.id);
        setFormData({
            name: camp.name,
            date: camp.date,
            location: camp.location
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', date: '', location: '' });
    };

    const handleDeleteCamp = async (id) => {
        if (!window.confirm("Are you sure you want to delete this camp?")) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/camps/list/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                addToast("Camp deleted successfully!", "success");
                fetchCamps();
                if (editingId === id) cancelEdit();
            } else {
                addToast("Failed to delete camp.", "error");
            }
        } catch (error) {
            addToast("Network error.", "error");
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
                <div className={`bg-white p-6 rounded-2xl border ${editingId ? 'border-amber-400 shadow-amber-100 shadow-lg' : 'border-slate-200 shadow-sm'} h-fit transition-all`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            {editingId ? <Edit2 size={20} className="text-amber-500" /> : <Plus size={20} className="text-brand-600" />}
                            {editingId ? 'Edit Camp' : 'Schedule New Camp'}
                        </h3>
                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors">
                                <X size={20} />
                            </button>
                        )}
                    </div>
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

                        <Button type="submit" className={`w-full mt-4 ${editingId ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30' : ''}`} isLoading={isCreating}>
                            {editingId ? 'Update Camp' : 'Create Camp'}
                        </Button>
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
                            <div key={camp.id} className={`bg-white p-6 rounded-2xl border ${editingId === camp.id ? 'border-amber-400 ring-4 ring-amber-50 shadow-md' : 'border-slate-200 shadow-sm hover:border-brand-300'} flex flex-col sm:flex-row justify-between gap-6 transition-all relative group overflow-hidden`}>
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

                                <div className="flex items-center gap-4">
                                    {/* Action Buttons */}
                                    <div className="flex sm:flex-col gap-2 opacity-100 sm:opacity-0 sm:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <button
                                            onClick={() => handleEditClick(camp)}
                                            className="p-2 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                                            title="Edit Camp"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCamp(camp.id)}
                                            className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                            title="Delete Camp"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* AI Prediction Box */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center min-w-[140px] text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Activity size={12} /> AI Prediction</p>
                                        <span className="text-3xl font-black text-brand-600">{camp.expected_donors}</span>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Expected Donors</p>
                                    </div>
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