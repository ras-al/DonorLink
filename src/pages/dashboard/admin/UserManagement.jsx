import { useState, useEffect, useCallback } from 'react';
import { Search, ShieldAlert, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/common/Button';

const ROLES = ['all', 'donor', 'hospital', 'organization', 'admin'];

const ROLE_BADGE = {
    donor: 'bg-brand-50 text-brand-700',
    hospital: 'bg-blue-50 text-blue-700',
    organization: 'bg-purple-50 text-purple-700',
    admin: 'bg-slate-100 text-slate-700',
};

const UserManagement = () => {
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin/users/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                addToast("Failed to fetch users.", "error");
            }
        } catch {
            addToast("Network error.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleAction = async (userId, actionName) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin/users/${userId}/${actionName}/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: `Admin triggered ${actionName}` })
            });
            if (response.ok) {
                addToast(`Successfully applied ${actionName}`, "success");
                fetchUsers();
            } else {
                addToast(`Failed to ${actionName} user.`, "error");
            }
        } catch {
            addToast("Network error.", "error");
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${userName}"? This action cannot be undone.`)) return;
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin/users/${userId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok || response.status === 204) {
                addToast("User permanently deleted.", "success");
                fetchUsers();
            } else {
                addToast("Failed to delete user.", "error");
            }
        } catch {
            addToast("Network error.", "error");
        }
    };

    const filteredUsers = users.filter(u => {
        const matchSearch =
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.profile_name && u.profile_name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    if (isLoading && users.length === 0) {
        return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <p className="text-slate-500">Monitor and manage all users across the platform.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                            type="text"
                            placeholder="Search users by email or name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm bg-white"
                        />
                    </div>

                    {/* Role Filter Pills */}
                    <div className="flex gap-1.5 flex-wrap">
                        {ROLES.map(role => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${roleFilter === role
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-300 hover:text-brand-600'}`}
                            >
                                {role === 'all' ? `All (${users.length})` : role}
                            </button>
                        ))}
                    </div>

                    <span className="text-xs text-slate-400 ml-auto font-medium">{filteredUsers.length} result(s)</span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold w-1/3">User</th>
                                <th className="px-5 py-3 font-semibold">Role</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold">Trust Score</th>
                                <th className="px-5 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-slate-400">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors align-middle">
                                        {/* User Info */}
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-800 leading-tight">{u.profile_name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{u.email}</div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${ROLE_BADGE[u.role] || 'bg-slate-100 text-slate-600'}`}>
                                                {u.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            {u.is_blacklisted ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                    <XCircle size={13} /> Blacklisted
                                                </span>
                                            ) : u.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    <CheckCircle size={13} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>

                                        {/* Trust Score */}
                                        <td className="px-5 py-4">
                                            {u.role === 'donor' && u.trust_score !== null ? (
                                                <span className={`font-bold text-base ${u.trust_score >= 60 ? 'text-green-600' : u.trust_score >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                                                    {u.trust_score}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 text-sm font-medium">N/A</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {u.role === 'donor' && !u.is_blacklisted && (
                                                    <button
                                                        onClick={() => handleAction(u.id, 'penalize')}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors"
                                                    >
                                                        Penalize
                                                    </button>
                                                )}
                                                {u.is_blacklisted ? (
                                                    <button
                                                        onClick={() => handleAction(u.id, 'reactivate')}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                                                    >
                                                        Reactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction(u.id, 'blacklist')}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <ShieldAlert size={12} /> Ban
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(u.id, u.profile_name || u.email)}
                                                    disabled={u.role === 'admin'}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1 ${u.role === 'admin' ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer'}`}
                                                    title={u.role === 'admin' ? 'Admin accounts cannot be deleted' : 'Delete user permanently'}
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
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
