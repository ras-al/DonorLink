import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Ban, Clock } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const SystemAudit = () => {
    const { addToast } = useToast();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blood/audit/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                } else {
                    addToast("Failed to fetch audit logs.", "error");
                }
            } catch (error) {
                addToast("Network error while fetching logs.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, [addToast]);

    const getIcon = (type) => {
        switch (type) {
            case 'ai_audit': return <ShieldAlert size={20} className="text-brand-600" />;
            case 'penalty': return <AlertTriangle size={20} className="text-yellow-600" />;
            case 'blacklist': return <Ban size={20} className="text-red-600" />;
            default: return <Clock size={20} className="text-slate-400" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'ai_audit': return 'bg-brand-50';
            case 'penalty': return 'bg-yellow-50';
            case 'blacklist': return 'bg-red-50';
            default: return 'bg-slate-50';
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
                <p className="text-slate-500">Track AI decisions, automated penalties, and administrative actions.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Activity Timeline</h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-brand-100 text-brand-700 rounded-full">{logs.length} Records</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {logs.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No audit logs found.</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors duration-150">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(log.type)}`}>
                                    {getIcon(log.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-slate-800">{log.title}</h4>
                                        <span className="text-xs text-slate-400">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">{log.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemAudit;
