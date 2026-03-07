import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity, Building2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Get the JWT Tokens from Django
            const loginResponse = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.email,
                    password: formData.password
                }),
            });

            const tokenData = await loginResponse.json();

            if (loginResponse.ok) {
                // Save tokens locally
                localStorage.setItem('access_token', tokenData.access);
                localStorage.setItem('refresh_token', tokenData.refresh);

                // 2. Fetch the User's Profile to get their actual Role
                const userResponse = await fetch('http://127.0.0.1:8000/api/auth/me/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenData.access}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();

                    // Update global auth state with the REAL user object
                    login(userData);

                    addToast('Logged in successfully!', 'success');
                    navigate('/dashboard');
                } else {
                    addToast('Failed to fetch user profile.', 'error');
                }

            } else {
                addToast(tokenData.detail || 'Invalid email or password.', 'error');
            }
        } catch (error) {
            addToast('Network error. Is the server running?', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* LEFT: Branding Section */}
            <div className="hidden lg:flex w-1/2 bg-brand-900 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 space-y-6 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight">Every drop creates a ripple of life.</h1>
                    <p className="text-brand-100 text-lg">Join the network of heroes and hospitals saving lives in real-time.</p>

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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="yourname@example.com"
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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