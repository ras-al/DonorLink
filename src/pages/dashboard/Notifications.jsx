import { useState } from 'react';
import { Activity, Calendar, ShieldCheck, CheckCircle2, Clock, Trash2, CheckCheck } from 'lucide-react';
import Button from '../../components/common/Button';

const Notifications = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    // Mock Notifications
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'emergency',
            title: 'URGENT: O+ Match Found',
            message: 'A critical patient at City Hospital matches your blood profile. Time remaining: 45 mins.',
            time: '10 mins ago',
            read: false,
        },
        {
            id: 2,
            type: 'camp',
            title: 'Upcoming Camp Nearby',
            message: 'TKM College NSS unit is organizing a drive 2km away from you this Saturday.',
            time: '2 hours ago',
            read: false,
        },
        {
            id: 3,
            type: 'system',
            title: 'Trust Score Updated',
            message: 'Your AI Trust score has increased to 98% after your recent successful donation.',
            time: '1 day ago',
            read: true,
        },
        {
            id: 4,
            type: 'system',
            title: 'Profile Verified',
            message: 'Your medical documents have been verified by our team. You are now an active donor.',
            time: '3 days ago',
            read: true,
        }
    ]);

    const getIcon = (type) => {
        switch (type) {
            case 'emergency': return <Activity size={20} className="text-red-600" />;
            case 'camp': return <Calendar size={20} className="text-brand-600" />;
            case 'system': return <ShieldCheck size={20} className="text-blue-600" />;
            default: return <Clock size={20} className="text-slate-600" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'emergency': return 'bg-red-50 border-red-100';
            case 'camp': return 'bg-brand-50 border-brand-100';
            case 'system': return 'bg-blue-50 border-blue-100';
            default: return 'bg-slate-50 border-slate-200';
        }
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const filteredNotifs = notifications.filter(n => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return !n.read;
        return n.type === activeFilter;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Notifications
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {notifications.filter(n => !n.read).length} New
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500">Stay updated with emergency alerts and system activities.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 px-3 text-sm" onClick={markAllAsRead}>
                        <CheckCheck size={16} /> Mark all read
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
                {['all', 'unread', 'emergency', 'camp', 'system'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition-all ${activeFilter === filter
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredNotifs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <CheckCircle2 size={48} className="text-slate-300 mb-4" />
                        <p className="font-medium text-lg text-slate-700">All caught up!</p>
                        <p className="text-sm">You have no {activeFilter !== 'all' ? activeFilter : ''} notifications at the moment.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredNotifs.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 relative group ${!notif.read ? 'bg-brand-50/30' : ''}`}
                            >
                                {/* Unread Indicator */}
                                {!notif.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500"></div>
                                )}

                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 shadow-sm ${getIconBg(notif.type)}`}>
                                    {getIcon(notif.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h3 className={`text-sm truncate ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${!notif.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                        {notif.message}
                                    </p>

                                    {/* Action Buttons (Render conditionally based on type and read status) */}
                                    {notif.type === 'emergency' && !notif.read && (
                                        <div className="mt-3 flex gap-2">
                                            <Button size="sm" className="h-8 text-xs px-4 bg-red-600 hover:bg-red-700 shadow-red-500/20">Accept Request</Button>
                                            <Button size="sm" variant="secondary" className="h-8 text-xs px-4">Decline</Button>
                                        </div>
                                    )}
                                </div>

                                {/* Hover Actions */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center pl-2">
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Notifications;