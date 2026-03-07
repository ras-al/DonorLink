import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Building2, ChevronLeft, Activity, Phone, MapPin, Calendar, Droplet, Weight, CheckCircle2, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LocationInput from '../../components/common/LocationInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    // UI State
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('donor'); // 'donor' | 'hospital' | 'organization'
    const [isLoading, setIsLoading] = useState(false);

    // Form Data State (This fixes the TypeError!)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        bloodGroup: '',
        dateOfBirth: '',
        weight: '',
        gender: '',
        phone: '',
        address: '',
        orgName: '',
        registrationId: '',
        lastDonationDate: '',
        diseaseConditions: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = (e) => {
        e.preventDefault();

        // Age validation
        if (step === 2 && role === 'donor' && formData.dateOfBirth) {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                addToast('You must be at least 18 years old to register as a donor.', 'error');
                return;
            }
        }

        setStep(step + 1);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Build the payload mapping our React State to the Django API expectations
        const payload = {
            role: role,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
        };

        if (role === 'donor') {
            payload.blood_group = formData.bloodGroup;
            payload.date_of_birth = formData.dateOfBirth;
            payload.weight = formData.weight;
            payload.gender = formData.gender;

            if (formData.lastDonationDate) {
                payload.last_donation_date = formData.lastDonationDate;
            }
            if (formData.diseaseConditions) {
                payload.disease_conditions = formData.diseaseConditions;
            }
        } else {
            payload.organization_name = formData.orgName;
            payload.registration_id = formData.registrationId;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                addToast('Registration successful! Please login to continue.', 'success');
                navigate('/login');
            } else {
                // Display the first error returned by Django
                const errorMsg = typeof data === 'object' ? Object.values(data)[0] : data.error;
                addToast(errorMsg || 'Registration failed.', 'error');
            }
        } catch (error) {
            addToast('Server connection failed. Is Django running?', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-slate-900">

            {/* LEFT: Requirements & Branding Section */}
            <div className="hidden lg:flex w-1/3 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-12">
                        <ChevronLeft size={20} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold leading-tight mb-4">Join DonorLink.</h1>
                    <p className="text-slate-400">
                        {role === 'donor' ? "Your contribution can save 3 lives with just one donation." : "Empower your organization with AI-driven blood network management."}
                    </p>
                </div>

                {role === 'donor' && (
                    <div className="relative z-10 bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-brand-500" />
                            Pre-Web Donation Checks
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>Age must be between 18 and 65 years.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>Weight should be at least 50 kg (110 lbs).</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>Minimum Hemoglobin level of 12.5 g/dL.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-300">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>No major surgeries or tattoos in the last 6 months.</span>
                            </li>
                        </ul>
                    </div>
                )}

                {(role === 'hospital' || role === 'organization') && (
                    <div className="relative z-10 bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-brand-500" />
                            Partner Verification
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            To maintain the integrity of our emergency response network, all institutional accounts require verified registration IDs. Our team will review your application within 24 hours.
                        </p>
                    </div>
                )}

                <div className="relative z-10 text-xs text-slate-500">
                    © 2026 DonorLink Network. All rights reserved.
                </div>
            </div>

            {/* RIGHT: Form Section */}
            <div className="w-full lg:w-2/3 flex items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
                <div className="w-full max-w-lg space-y-8">

                    {/* Header with Stepper */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                                <p className="text-slate-500 mt-1">
                                    {step === 1 ? "Let's start with your login details." : step === 2 ? "Medical & Demographics." : "Final contact details."}
                                </p>
                            </div>

                            {/* Dynamic Stepper - 3 Steps for Donors */}
                            {role === 'donor' && (
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 1 ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-slate-200'}`}>1</span>
                                    <div className={`w-6 sm:w-8 h-0.5 rounded-full transition-colors ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 2 ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-slate-200'}`}>2</span>
                                    <div className={`w-6 sm:w-8 h-0.5 rounded-full transition-colors ${step >= 3 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 3 ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-slate-200'}`}>3</span>
                                </div>
                            )}
                        </div>

                        {/* Role Switcher - Only visible on Step 1 */}
                        {step === 1 && (
                            <div className="bg-slate-100 p-1 rounded-xl flex animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { setRole('donor'); setStep(1); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'donor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <User size={18} /> Donor
                                </button>
                                <button
                                    onClick={() => { setRole('hospital'); setStep(1); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'hospital' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Building2 size={18} /> Hospital
                                </button>
                                <button
                                    onClick={() => { setRole('organization'); setStep(1); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'organization' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Activity size={18} /> Org/NGO
                                </button>
                            </div>
                        )}
                    </div>

                    {/* DONOR MULTI-STEP FORM */}
                    {role === 'donor' && (
                        <form onSubmit={step === 3 ? handleRegister : handleNext} className="space-y-6">

                            {/* STEP 1: CREDENTIALS */}
                            {step === 1 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} icon={User} placeholder="Raoh" required />
                                    <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} icon={Mail} placeholder="raoh@example.com" required />
                                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} icon={Lock} placeholder="••••••••" required />
                                </div>
                            )}

                            {/* STEP 2: PROFILE & MEDICAL */}
                            {step === 2 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Blood Group</label>
                                        <div className="relative">
                                            <Droplet className="absolute left-3 top-3.5 text-red-500" size={18} />
                                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer" required>
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-600" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                                            <div className="relative">
                                                <Weight className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} min="50" placeholder="e.g. 65" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Last Donation Date (Optional)</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input type="date" name="lastDonationDate" value={formData.lastDonationDate} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-600" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Any disease? (If yes, specify)</label>
                                            <div className="relative">
                                                <Activity className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input type="text" name="diseaseConditions" value={formData.diseaseConditions} onChange={handleChange} placeholder="e.g. None" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: LOCATION & SUBMIT */}
                            {step === 3 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" icon={Phone} placeholder="+91 98765 43210" required />
                                    <LocationInput
                                        label="Address / City"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="e.g. 123 Main St, Kollam"
                                        isTextArea={true}
                                        required={true}
                                    />

                                    <div className="flex items-start gap-2 pt-2">
                                        <input type="checkbox" className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300" required />
                                        <span className="text-sm text-slate-600">I agree to the <Link to="/terms" className="text-brand-600 font-semibold hover:underline">Terms</Link> and <Link to="/privacy" className="text-brand-600 font-semibold hover:underline">Privacy Policy</Link>.</span>
                                    </div>
                                </div>
                            )}

                            {/* Donor Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                {step > 1 && (
                                    <Button type="button" variant="secondary" onClick={() => setStep(step - 1)} className="px-6">
                                        Back
                                    </Button>
                                )}
                                <Button type="submit" className="flex-1" isLoading={isLoading}>
                                    {step < 3 ? <>Next Step <ChevronRight size={18} /></> : <>Create Account <CheckCircle2 size={18} /></>}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* HOSPITAL / ORGANIZATION FORM (Single Step) */}
                    {(role === 'hospital' || role === 'organization') && (
                        <form onSubmit={handleRegister} className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                            <Input label={`${role === 'hospital' ? 'Hospital' : 'Organization'} Name`} name="orgName" value={formData.orgName} onChange={handleChange} icon={Building2} placeholder={`e.g. ${role === 'hospital' ? 'City General Hospital' : 'NSS Unit 174'}`} required />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Official Email" name="email" value={formData.email} onChange={handleChange} type="email" icon={Mail} placeholder="admin@example.com" required />
                                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" icon={Phone} placeholder="+91 98765 43210" required />
                            </div>
                            <Input label="Registration / License ID" name="registrationId" value={formData.registrationId} onChange={handleChange} icon={ShieldCheck} placeholder="Govt. Registration Number" required />

                            <LocationInput
                                label="Full Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Complete institutional address"
                                isTextArea={true}
                                required={true}
                            />

                            <Input label="Create Password" name="password" value={formData.password} onChange={handleChange} type="password" icon={Lock} placeholder="••••••••" required />

                            <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                                Register {role === 'hospital' ? 'Hospital' : 'Organization'} <ArrowRight size={18} />
                            </Button>
                        </form>
                    )}

                    <p className="text-center text-slate-500 text-sm">
                        Already have an account? <Link to="/login" className="font-bold text-brand-600 hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;