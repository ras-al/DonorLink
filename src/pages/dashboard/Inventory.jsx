import { useState, useEffect } from 'react';
import { Plus, Minus, Search, Droplet, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { addToast } = useToast();

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    // Fetch Inventory from Django
    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blood/inventory/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                // Map Django data to our full blood groups array (defaulting to 0 if not exists)
                const formattedData = bloodGroups.map(bg => {
                    const existing = data.find(item => item.blood_group === bg);
                    return existing || { blood_group: bg, units_available: 0, isNew: true };
                });
                setInventory(formattedData);
            }
        } catch (error) {
            addToast("Failed to load inventory", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Handle saving updates to Django
    const updateUnit = async (item, amount) => {
        const newAmount = Math.max(0, item.units_available + amount);
        setIsUpdating(true);

        try {
            const token = localStorage.getItem('access_token');
            const url = item.isNew
                ? `${import.meta.env.VITE_API_URL}/api/blood/inventory/` // POST for new
                : `${import.meta.env.VITE_API_URL}/api/blood/inventory/${item.id}/`; // PUT/PATCH for existing

            const method = item.isNew ? 'POST' : 'PATCH';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blood_group: item.blood_group,
                    units_available: newAmount
                })
            });

            if (response.ok) {
                fetchInventory(); // Refresh data to get real IDs and updated timestamps
                addToast(`${item.blood_group} inventory updated!`, 'success');
            } else {
                addToast("Failed to update unit", "error");
            }
        } catch (error) {
            addToast("Network error", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blood Bank Inventory</h1>
                    <p className="text-slate-500">Manage your real-time blood stock levels.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={fetchInventory} isLoading={isLoading}>
                        <RefreshCw size={18} /> Refresh
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading inventory from database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {inventory.map((item) => (
                        <div key={item.blood_group} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-200 transition-all flex flex-col justify-between h-48 group relative overflow-hidden">

                            {/* Low Stock Warning */}
                            {item.units_available < 10 && (
                                <div className="absolute top-0 right-0 bg-red-50 text-red-600 px-3 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1">
                                    <AlertCircle size={12} /> Low Stock
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3 mb-4 text-slate-500">
                                    <Droplet className={item.units_available > 20 ? 'text-brand-500' : 'text-red-500'} size={24} />
                                    <span className="font-semibold">{item.blood_group} Blood</span>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className={`text-5xl font-bold tracking-tight ${item.units_available < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                                        {item.units_available}
                                    </span>
                                    <span className="text-slate-400 font-medium">Units</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => updateUnit(item, -1)}
                                    disabled={item.units_available === 0 || isUpdating}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus size={18} />
                                </button>
                                <button
                                    onClick={() => updateUnit(item, 1)}
                                    disabled={isUpdating}
                                    className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inventory;