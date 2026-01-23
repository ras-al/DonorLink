
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Building2, ChevronLeft, Activity, Phone, MapPin, Calendar, Droplet, Weight, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('donor'); // 'donor' | 'hospital'
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (role === 'hospital') {
                // For hospitals, we might just submit or have a different step 2. 
                // For now, let's keep it simple and submit if it's hospital, or go to step 2 if we want address.
                // Let's assume hospitals also need address, so go to step 2.
                setStep(2);
            } else {
                setStep(2);
            }
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
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
                    <p className="text-slate-400">Your contribution can save 3 lives with just one donation.</p>
                </div>

                {role === 'donor' && (
                    <div className="relative z-10 bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50">
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
                                    {step === 1 ? "Let's start with your login details." : "Just a few more details about you."}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 1 ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-slate-200'}`}>1</span>
                                <div className={`w-8 h-0.5 rounded-full transition-colors ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 2 ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-slate-200'}`}>2</span>
                            </div>
                        </div>

                        {/* Role Switcher - Only visible on Step 1 */}
                        {step === 1 && (
                            <div className="bg-slate-100 p-1 rounded-xl flex animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => setRole('donor')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'donor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Activity size={18} /> Donor
                                </button>
                                <button
                                    onClick={() => setRole('hospital')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'hospital' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Building2 size={18} /> Hospital / Org
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleNext} className="space-y-6">

                        {/* STEP 1: CREDENTIALS */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder={role === 'donor' ? "John Doe" : "City Hospital"}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            placeholder="Create a password"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: PROFILE & LOCATION */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">

                                {role === 'donor' && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Medical Profile</h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Blood Group</label>
                                                <div className="relative">
                                                    <Droplet className="absolute left-3 top-3.5 text-red-500" size={18} />
                                                    <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer">
                                                        <option value="">Select</option>
                                                        <option value="A+">A+</option>
                                                        <option value="A-">A-</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B-">B-</option>
                                                        <option value="O+">O+</option>
                                                        <option value="O-">O-</option>
                                                        <option value="AB+">AB+</option>
                                                        <option value="AB-">AB-</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                    <input
                                                        type="date"
                                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Gender</label>
                                                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                                                    <option value="">Select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                                                <div className="relative">
                                                    <Weight className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 65"
                                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Location</h3>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Address / City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <textarea
                                                placeholder={role === 'donor' ? "e.g. 123 Main St, Mumbai" : "e.g. Apollo Hospital, Jubilee Hills, Hyderabad"}
                                                rows="2"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 pt-2">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300" required />
                                    <span className="text-sm text-slate-600">I agree to the <a href="#" className="text-brand-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 font-semibold hover:underline">Privacy Policy</a>.</span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            {step === 2 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="w-1/3"
                                >
                                    Back
                                </Button>
                            )}
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                {step === 1 ? (
                                    <>Next Step <ChevronRight size={18} /></>
                                ) : (
                                    <>Create Account <ArrowRight size={18} /></>
                                )}
                            </Button>
                        </div>

                    </form>

                    <p className="text-center text-slate-500 text-sm">
                        Already have an account? <Link to="/login" className="font-bold text-brand-600 hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
