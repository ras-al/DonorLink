import { useState } from 'react';
import { Plus, Minus, Droplets, Search, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Inventory = () => {
    // Mock Inventory Data
    const [stock, setStock] = useState([
        { type: 'A+', count: 12, status: 'Stable' },
        { type: 'A-', count: 4, status: 'Low' },
        { type: 'B+', count: 25, status: 'Excess' },
        { type: 'B-', count: 8, status: 'Stable' },
        { type: 'AB+', count: 10, status: 'Stable' },
        { type: 'AB-', count: 2, status: 'Critical' },
        { type: 'O+', count: 45, status: 'Excess' },
        { type: 'O-', count: 5, status: 'Low' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'Low': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Excess': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blood Inventory</h1>
                    <p className="text-slate-500">Manage real-time blood stock availability.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10"><Filter size={18} /> Filter</Button>
                    <Button className="h-10"><Plus size={18} /> Add Stock</Button>
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stock.map((item) => (
                    <div key={item.type} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-red-50 text-brand-600 rounded-xl flex items-center justify-center text-xl font-extrabold shadow-sm">
                                    {item.type}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-3xl font-bold text-slate-900">{item.count}</span>
                                <span className="text-sm text-slate-500 font-medium">units</span>
                            </div>

                            <p className="text-xs text-slate-400 mb-6">Last updated: 2 hrs ago</p>

                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                                    <Minus size={16} />
                                </button>
                                <button className="flex-1 flex items-center justify-center py-2 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table (Placeholder) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Blood Type</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Staff</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3].map(i => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-slate-500">#TXN-882{i}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700">O+</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">+ Added 5 Units</td>
                                    <td className="px-6 py-4 text-slate-500">Oct 24, 2025</td>
                                    <td className="px-6 py-4 text-slate-600">Dr. Sarah</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
