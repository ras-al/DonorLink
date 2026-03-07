import { useState } from 'react';
import { User, Lock, Bell, Shield, Save, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LocationInput from '../../components/common/LocationInput';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { addToast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        address: user?.address || '',
        last_donation_date: user?.last_donation_date || '',
        disease_conditions: user?.disease_conditions || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                addToast('Settings updated successfully!', 'success');
            } else {
                addToast('Failed to update settings.', 'error');
            }
        } catch (error) {
            addToast('Network error.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and system settings.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
                    {[
                        { id: 'profile', label: 'Personal Info', icon: User },
                        { id: 'security', label: 'Security', icon: Lock },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'privacy', label: 'Privacy & Data', icon: Shield },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-brand-50 text-brand-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8">
                    <form onSubmit={handleSave} className="h-full flex flex-col">

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                                    <p className="text-sm text-slate-500">Update your basic profile details.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <Input label="Full Name" defaultValue={user?.name || ''} disabled className="bg-slate-100 cursor-not-allowed" />
                                    <Input label="Email Address" type="email" defaultValue={user?.email || ''} disabled className="bg-slate-100 cursor-not-allowed" />
                                    <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                                    {user?.role === 'donor' && (
                                        <Input label="Blood Group" defaultValue={user?.blood_group || 'N/A'} disabled className="bg-slate-100 cursor-not-allowed" />
                                    )}
                                </div>

                                {user?.role === 'donor' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pb-4 border-b border-slate-100">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Last Donation Date</label>
                                            <input type="date" name="last_donation_date" value={formData.last_donation_date || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Disease / Medical Conditions</label>
                                            <input type="text" name="disease_conditions" value={formData.disease_conditions || ''} onChange={handleChange} placeholder="e.g. None" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-600" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 pt-4">
                                    <h4 className="font-semibold text-slate-800 flex items-center gap-2"><MapPin size={18} /> Location Setup</h4>
                                    <p className="text-sm text-slate-500 mb-4">Your location is crucial for matching with nearby emergencies.</p>
                                    <LocationInput label="Primary Address" name="address" value={formData.address} onChange={handleChange} />
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="gps" className="rounded text-brand-600 focus:ring-brand-500" defaultChecked />
                                        <label htmlFor="gps" className="text-sm text-slate-700">Allow background GPS tracking for live emergency matching</label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Security & Password</h3>
                                    <p className="text-sm text-slate-500">Ensure your account is secure.</p>
                                </div>

                                <div className="max-w-md space-y-4">
                                    <Input label="Current Password" type="password" placeholder="••••••••" />
                                    <Input label="New Password" type="password" placeholder="••••••••" />
                                    <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-2">Two-Factor Authentication (2FA)</h4>
                                    <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
                                    <Button variant="outline" type="button">Enable 2FA via SMS</Button>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
                                    <p className="text-sm text-slate-500">Choose what alerts you want to receive.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: "Critical Emergency Alerts", desc: "Get notified immediately if a matching patient needs blood nearby.", default: true },
                                        { title: "Donation Camp Invites", desc: "Receive invites for nearby drives organized by verified NGOs.", default: true },
                                        { title: "Trust Score Updates", desc: "Weekly summaries of your AI reliability score.", default: false },
                                        { title: "Marketing & News", desc: "Updates about DonorLink features and community stories.", default: false },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={item.default} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PRIVACY TAB */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Privacy & Data</h3>
                                    <p className="text-sm text-slate-500">Control how your data is used by our AI models.</p>
                                </div>

                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
                                    Your medical data is encrypted and only shared with verified hospitals during an active emergency request.
                                </div>

                                <div className="space-y-4 mt-6">
                                    <Button variant="outline" className="w-full justify-start text-slate-700" type="button">Download My Data Archive</Button>
                                    <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 hover:border-red-200" type="button">Deactivate Account</Button>
                                </div>
                            </div>
                        )}

                        {/* Bottom Save Action */}
                        <div className="mt-auto pt-8 flex justify-end">
                            <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                                <Save size={18} /> Save Changes
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;