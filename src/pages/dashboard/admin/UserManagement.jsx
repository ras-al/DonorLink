import { useState, useEffect, useCallback } from 'react';
import { Search, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/common/Button';

const UserManagement = () => {
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/auth/admin/users/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                addToast("Failed to fetch users.", "error");
            }
        } catch (error) {
            addToast("Network error.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAction = async (userId, actionName) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/auth/admin/users/${userId}/${actionName}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: `Admin triggered ${actionName}` })
            });
            if (response.ok) {
                addToast(`Successfully applied ${actionName}`, "success");
                fetchUsers(); // Refresh the list
            } else {
                addToast(`Failed to ${actionName} user.`, "error");
            }
        } catch (error) {
            addToast("Network error.", "error");
        }
    };

    const filteredUsers = users.filter((u) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.profile_name && u.profile_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading && users.length === 0) {
        return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Monitor and manage all users across the platform.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users by email or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold w-1/4">User</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Trust Score</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-800">{u.profile_name}</div>
                                            <div className="text-xs text-slate-500">{u.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 capitalize">{u.role}</td>
                                        <td className="p-4">
                                            {u.is_blacklisted ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                    <XCircle size={14} /> Blacklisted
                                                </span>
                                            ) : u.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    <CheckCircle size={14} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {u.role === 'donor' && u.trust_score !== null ? (
                                                <span className={`font-bold ${u.trust_score >= 60 ? 'text-green-600' : u.trust_score >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {u.trust_score}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">N/A</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {u.role === 'donor' && !u.is_blacklisted && (
                                                <Button size="sm" variant="outline" onClick={() => handleAction(u.id, 'penalize')} className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                                                    Penalize
                                                </Button>
                                            )}
                                            {u.is_blacklisted ? (
                                                <Button size="sm" variant="outline" onClick={() => handleAction(u.id, 'reactivate')} className="text-green-600 border-green-200 hover:bg-green-50">
                                                    Reactivate
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={() => handleAction(u.id, 'blacklist')} className="text-red-600 border-red-200 hover:bg-red-50">
                                                    <ShieldAlert size={14} className="mr-1" /> Ban
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
