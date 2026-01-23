import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity, Building2, ChevronLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('donor'); // 'donor' | 'hospital'
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex bg-white">

            {/* LEFT: Branding Section */}
            <div className="hidden lg:flex w-1/2 bg-brand-900 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 space-y-6 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight">Every drop creates a ripple of life.</h1>
                    <p className="text-brand-100 text-lg">Join the network of 12,000+ heroes and hospitals saving lives in real-time.</p>

                    {/* Trust Stats */}
                    <div className="grid grid-cols-2 gap-6 pt-6">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                            <p className="text-3xl font-bold">15m</p>
                            <p className="text-sm text-brand-200">Avg Response Time</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                            <p className="text-3xl font-bold">100%</p>
                            <p className="text-sm text-brand-200">Verified Donors</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">

                {/* Go Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-medium"
                >
                    <ChevronLeft size={20} /> Back to Home
                </button>

                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="bg-slate-100 p-1 rounded-xl flex">
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

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    placeholder={role === 'donor' ? "alex@example.com" : "admin@hospital.com"}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300" />
                                <span className="text-slate-600">Remember me</span>
                            </label>
                            <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">Forgot password?</a>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="text-center text-slate-500 text-sm">
                        Don't have an account? <Link to="/register" className="font-bold text-brand-600 hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;