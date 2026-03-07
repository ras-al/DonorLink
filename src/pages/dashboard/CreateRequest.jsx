import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, Clock, CheckCircle2, Search, MapPin, ChevronRight, User } from 'lucide-react';
import Button from '../../components/common/Button';
import LocationInput from '../../components/common/LocationInput';
import { useToast } from '../../context/ToastContext';

const CreateRequest = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [step, setStep] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    // Form State
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [admissionId, setAdmissionId] = useState('');
    const [location, setLocation] = useState('');
    const [urgency, setUrgency] = useState('medium');
    const [bloodGroup, setBloodGroup] = useState('');

    // Handle the final submission to Django
    const handleSearchAndSubmit = async () => {
        if (!bloodGroup) {
            addToast("Please select a blood group.", "error");
            return;
        }

        setStep(3);
        setIsSearching(true);

        try {
            // 1. Get the auth token
            const token = localStorage.getItem('access_token');
            if (!token) {
                addToast("You must be logged in to create a request.", "error");
                navigate('/login');
                return;
            }

            // 2. Prepare the payload matching Django's BloodRequest model
            const payload = {
                patient_name: patientName,
                blood_group: bloodGroup,
                urgency_level: urgency,
                // Automatically generate required date, use inputted location
                location: location || "Current Hospital Location",
                required_date: new Date().toISOString()
            };

            // 3. Send POST request to Django
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blood/requests/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- IMPORTANT: Secure token
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // Simulate AI matching delay for UX
                setTimeout(() => {
                    setIsSearching(false);
                    addToast("Emergency request broadcasted successfully!", "success");
                }, 2500);
            } else {
                setIsSearching(false);
                setStep(2); // Go back if error
                addToast(data.detail || "Failed to create request.", "error");
            }

        } catch (error) {
            setIsSearching(false);
            setStep(2);
            addToast("Server error. Ensure Django is running.", "error");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Create Blood Request</h1>
                    <p className="text-slate-500">AI-Powered matching will prioritize donors based on urgency.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-bold border border-red-100">
                    <Activity size={18} className="animate-pulse" /> Emergency Mode Active
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Main Form Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Step Indicator */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 font-bold ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>1</span>
                            Patient
                        </div>
                        <div className="w-12 h-1 bg-slate-200">
                            <div className={`h-full bg-brand-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className={`flex items-center gap-2 font-bold ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>2</span>
                            Details
                        </div>
                        <div className="w-12 h-1 bg-slate-200">
                            <div className={`h-full bg-brand-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className={`flex items-center gap-2 font-bold ${step >= 3 ? 'text-brand-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>3</span>
                            AI Match
                        </div>
                    </div>

                    {/* STEP 1: Patient Details */}
                    {step === 1 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <User size={20} className="text-brand-600" /> Patient Information
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Patient Name</label>
                                    <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Age</label>
                                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="e.g. 34" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Hospital Admission ID</label>
                                    <input type="text" value={admissionId} onChange={(e) => setAdmissionId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="e.g. HOSP-2026-889" />
                                </div>
                                <div className="space-y-1">
                                    <LocationInput
                                        label="Hospital Location"
                                        name="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Kozhikode"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button onClick={() => {
                                    if (!patientName) return addToast("Enter patient name", "error");
                                    setStep(2);
                                }}>Next Step <ChevronRight size={18} /></Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Blood Requirements */}
                    {step === 2 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-brand-600" /> Blood Requirements
                            </h3>

                            {/* Urgency Selector */}
                            <div className="mb-8">
                                <label className="text-sm font-medium text-slate-700 mb-3 block">Urgency Level</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button onClick={() => setUrgency('low')} className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === 'low' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-slate-100 hover:border-slate-300'}`}>
                                        Low <span className="block text-xs font-normal mt-1 text-slate-500">Scheduled Surgery</span>
                                    </button>
                                    <button onClick={() => setUrgency('medium')} className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold' : 'border-slate-100 hover:border-slate-300'}`}>
                                        Medium <span className="block text-xs font-normal mt-1 text-slate-500">Within 24 Hours</span>
                                    </button>
                                    <button onClick={() => setUrgency('critical')} className={`p-4 rounded-xl border-2 text-center transition-all ${urgency === 'critical' ? 'border-red-600 bg-red-50 text-red-700 font-bold ring-2 ring-red-500/20' : 'border-slate-100 hover:border-slate-300'}`}>
                                        <span className="flex items-center justify-center gap-2">CRITICAL <AlertCircle size={16} /></span>
                                        <span className="block text-xs font-normal mt-1 text-slate-500">Immediate Action</span>
                                    </button>
                                </div>
                            </div>

                            {/* Blood Group Grid */}
                            <div className="mb-8">
                                <label className="text-sm font-medium text-slate-700 mb-3 block">Required Blood Group</label>
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <button
                                            key={bg}
                                            onClick={() => setBloodGroup(bg)}
                                            className={`aspect-square rounded-xl border-2 transition-all font-bold ${bloodGroup === bg ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'border-slate-200 text-slate-700 hover:border-brand-400'}`}
                                        >
                                            {bg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={handleSearchAndSubmit} variant={urgency === 'critical' ? 'primary' : 'primary'}>
                                    {urgency === 'critical' ? 'Broadcast Emergency' : 'Find Donors'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: AI Processing Visualization */}
                    {step === 3 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-4 relative overflow-hidden">
                            {isSearching ? (
                                <div className="text-center py-12 space-y-6">
                                    <div className="relative inline-block">
                                        <div className="w-24 h-24 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Search className="text-brand-600 animate-pulse" size={32} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">AI is Analyzing Donor Database</h3>
                                        <p className="text-slate-500 mt-2">Filtering by Location, Trust Score, and Last Donation Date...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Request Broadcasted!</h3>
                                    <p className="text-slate-500 mt-2 mb-8">AI identified highly-rated {bloodGroup} donors nearby. Alerts have been pushed.</p>

                                    <Button className="w-full" onClick={() => navigate('/dashboard/requests')}>Monitor Responses</Button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* RIGHT: Live Stats Widget */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Inventory Target</h4>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-bold">{bloodGroup || '-'}</span>
                            <span className="text-brand-400 font-bold mb-1 text-sm">Requested</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4">AI Prediction</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Clock size={18} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Est. Fulfillment Time</p>
                                    <p className="font-bold text-slate-800">{urgency === 'critical' ? '10 - 15 Mins' : '1 - 2 Hours'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><MapPin size={18} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Donor Availability</p>
                                    <p className="font-bold text-slate-800">High</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateRequest;