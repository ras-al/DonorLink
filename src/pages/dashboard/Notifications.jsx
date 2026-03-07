import { Bell } from 'lucide-react';

const Notifications = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-500">System alerts and emergency broadcasts.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-slate-300 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">You're all caught up!</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                    When there are critical updates regarding your requests, profile, or nearby emergencies, they will appear here.
                </p>
            </div>
        </div>
    );
};

export default Notifications;