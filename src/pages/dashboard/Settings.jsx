
import { useState } from 'react';
import { User, Bell, Shield, Save, Mail, Smartphone, MapPin, Moon } from 'lucide-react';
import Button from '../../components/common/Button';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and security.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* SIDEBAR TABS */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    {[
                        { id: 'profile', label: 'My Profile', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${activeTab === tab.id
                                    ? 'bg-white text-brand-600 shadow-sm border border-slate-100'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h3>
                                <p className="text-slate-500 text-sm">Update your public profile details.</p>
                            </div>

                            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-20 h-20 rounded-full border-2 border-slate-100" />
                                <div>
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                    <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input type="text" defaultValue="Alex Johnson" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Phone</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input type="tel" defaultValue="+91 98765 43210" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                                    </div>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input type="email" defaultValue="alex.j@example.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                                    </div>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <textarea defaultValue="Mumbai, Maharashtra" rows="2" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 resize-none"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button><Save size={18} /> Save Changes</Button>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Notification Preferences</h3>
                                <p className="text-slate-500 text-sm">Choose how you want to be notified.</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: 'Emergency Alerts', desc: 'Receive immediate alerts for urgent blood requests nearby.', checked: true },
                                    { title: 'Camp Reminders', desc: 'Get notified about upcoming donation camps in your city.', checked: true },
                                    { title: 'Trust Score Updates', desc: 'Notify me when my trust score changes.', checked: false },
                                    { title: 'Marketing Emails', desc: 'Receive news, updates, and campaign info.', checked: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start justify-between pb-6 border-b border-slate-100 last:border-0">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{item.title}</h4>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Security & Login</h3>
                                <p className="text-slate-500 text-sm">Update your password to keep your account safe.</p>
                            </div>

                            <div className="space-y-4 max-w-md">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                                    <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">New Password</label>
                                    <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                                    <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                                </div>
                                <Button className="mt-2">Update Password</Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Settings;
