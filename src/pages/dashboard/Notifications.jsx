
import { Bell, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-500">Stay updated with emergency alerts and camp reminders.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100">
                    {[
                        {
                            type: 'emergency',
                            title: 'Urgent: A+ Blood Needed Nearby',
                            desc: 'City General Hospital requires A+ blood for a critical patient. 2.5km away.',
                            time: '10 mins ago',
                            action: 'View Request'
                        },
                        {
                            type: 'info',
                            title: 'Camp Registration Confirmed',
                            desc: 'You have successfully registered for the "Tech Park Donation Drive" on Jan 25.',
                            time: '2 hours ago',
                            action: null
                        },
                        {
                            type: 'success',
                            title: 'Trust Score Updated',
                            desc: 'Thanks for your recent verification! Your Trust Score increased by +5 points.',
                            time: '1 day ago',
                            action: 'View Profile'
                        },
                        {
                            type: 'info',
                            title: 'New Feature: AI Prediction',
                            desc: 'Donors can now see estimated wait times at camps via the app.',
                            time: '2 days ago',
                            action: null
                        },
                    ].map((notif, i) => (
                        <div key={i} className={`p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors ${notif.type === 'emergency' ? 'bg-red-50/50' : ''}`}>
                            <div className={`p-3 rounded-full shrink-0 ${notif.type === 'emergency' ? 'bg-red-100 text-red-600' :
                                    notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {notif.type === 'emergency' ? <AlertTriangle size={20} /> :
                                    notif.type === 'success' ? <CheckCircle2 size={20} /> :
                                        <Bell size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold ${notif.type === 'emergency' ? 'text-red-700' : 'text-slate-900'}`}>
                                        {notif.title}
                                    </h4>
                                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">{notif.time}</span>
                                </div>
                                <p className="text-slate-600 text-sm mt-1">{notif.desc}</p>
                                {notif.action && (
                                    <button className="text-brand-600 text-sm font-bold mt-2 hover:underline">
                                        {notif.action}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Mark all as read</button>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
