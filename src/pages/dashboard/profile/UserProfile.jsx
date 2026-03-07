import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const UserProfile = () => {
    const { user } = useAuth();
    const { addToast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        is_available: true,
        trust_score: 0,
        blood_group: ''
    });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    phone: data.phone || '',
                    address: data.address || '',
                    is_available: data.is_available ?? true,
                    trust_score: data.trust_score || 0,
                    blood_group: data.blood_group || ''
                });
            }
        } catch (error) {
            addToast("Failed to load profile", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    address: formData.address,
                    is_available: formData.is_available
                })
            });

            if (response.ok) {
                addToast("Profile updated successfully!", "success");
                setIsEditing(false);
            } else {
                addToast("Failed to update profile", "error");
            }
        } catch (error) {
            addToast("Network error", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
                {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit2 size={16} className="mr-2" /> Edit Details
                    </Button>
                ) : (
                    <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                    <img src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-slate-50" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-slate-500 capitalize">{user?.role}</p>

                        {user?.role === 'donor' && (
                            <div className="flex gap-3 mt-3">
                                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm font-bold border border-brand-100">
                                    {formData.blood_group} Blood
                                </span>
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold border border-amber-100 flex items-center gap-1">
                                    <Shield size={14} /> Trust Score: {formData.trust_score}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Email Address" value={user?.email} icon={Mail} disabled />
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            icon={Phone}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Full Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="2"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none disabled:opacity-60 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {user?.role === 'donor' && (
                        <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between transition-colors ${formData.is_available ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                            <div>
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    {formData.is_available ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-slate-400" />}
                                    Available for Emergencies
                                </h4>
                                <p className="text-sm text-slate-500 mt-0.5">Allow hospitals to ping you for urgent blood requests.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} disabled={!isEditing} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;