import { ArrowRight, Droplets, ShieldCheck, Activity, Users, Heart, Clock, MapPin, Award, CheckCircle2, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Footer from '../../components/layout/Footer';
import { TextReveal, FadeIn } from '../../components/common/TextReveal';
import GlitchText from '../../components/common/GlitchText';
import { motion } from 'framer-motion';

const CountUp = ({ end, label }) => {
    const [count, setCount] = useState(0);
    const duration = 2000; // 2 seconds

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            if (progress < duration) {
                const percentage = progress / duration;
                // Ease out quart
                const ease = 1 - Math.pow(1 - percentage, 4);

                setCount(Math.floor(end * ease));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animationFrame = requestAnimationFrame(animate);
                observer.disconnect();
            }
        });

        const element = document.getElementById(`stat-${label}`);
        if (element) observer.observe(element);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            observer.disconnect();
        };
    }, [end, label]);

    return (
        <div id={`stat-${label}`} className="hover:scale-110 transition-transform duration-300 cursor-default">
            <div className="text-4xl font-extrabold text-brand-500 mb-2">
                {count}{label.includes('Donors') || label.includes('Active') ? '+' : ''}{label.includes('Saved') ? 'k' : ''}
            </div>
            <div className="text-slate-400 font-medium">{label}</div>
        </div>
    );
};

const Landing = () => {
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (showIntro) {
        return (
            <div className="fixed inset-0 bg-slate-900 z-[100] flex items-center justify-center animate-fade-out-up delay-[800ms] pointer-events-none">
                <div className="text-center">
                    <div className="w-24 h-24 bg-brand-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/50 animate-bounce">
                        <Droplets size={48} fill="currentColor" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight animate-pulse">DonorLink</h1>
                    <p className="text-brand-200 mt-2 font-medium">Connecting Hearts, Saving Lives</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900 animate-in fade-in duration-700">

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-2xl tracking-tight">
                        <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 transition-transform hover:rotate-12 hover:scale-110">
                            <Droplets size={24} fill="currentColor" />
                        </div>
                        DonorLink
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                        <a href="#" className="hover:text-brand-600 transition-colors hover:scale-105 transform">Find Donors</a>
                        <a href="#" className="hover:text-brand-600 transition-colors hover:scale-105 transform">Donate</a>
                        <a href="#" className="hover:text-brand-600 transition-colors hover:scale-105 transform">Organize Camp</a>
                    </div>

                    <div className="flex gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="hidden md:flex hover:bg-slate-100">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="hidden md:flex hover:scale-105 hover:shadow-lg transition-all">Get Started</Button>
                        </Link>
                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden p-2 text-slate-600" onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
                {/* Mobile Menu Dropdown */}
                <div id="mobile-menu" className="hidden md:hidden bg-white border-b border-slate-100 p-4 absolute w-full animate-in slide-in-from-top-5">
                    <div className="flex flex-col gap-4 font-medium text-slate-600">
                        <a href="#" className="hover:text-brand-600 transition-colors">Find Donors</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Donate</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Organize Camp</a>
                        <hr className="border-slate-100" />
                        <Link to="/login" className="w-full">
                            <Button variant="ghost" className="w-full justify-start">Login</Button>
                        </Link>
                        <Link to="/register" className="w-full">
                            <Button className="w-full">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    {/* Left Content */}
                    <div className="relative z-10 space-y-8">
                        <FadeIn delay={0.2}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-brand-700 rounded-full text-sm font-bold border border-red-100 cursor-default">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <GlitchText text="URGENT: O+ Donors needed in your area" />
                            </div>
                        </FadeIn>

                        <div className="space-y-2">
                            <TextReveal text="Saving lives is" className="text-4xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight" />
                            <TextReveal text="in your blood." className="text-4xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400" delay={0.5} />
                        </div>

                        <FadeIn delay={0.8}>
                            <p className="text-lg lg:text-xl text-slate-600 max-w-lg leading-relaxed">
                                DonorLink connects hospitals, donors, and organizations in real-time. Smart matching, zero wastage, 100% transparent.
                            </p>
                        </FadeIn>

                        <FadeIn delay={1} className="flex flex-col gap-4 pt-4 w-full sm:w-auto">
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button className="h-14 px-8 text-lg shadow-brand-500/40 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full transition-all duration-300">
                                    Find a Donor <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button variant="secondary" className="h-14 px-8 text-lg w-full hover:bg-slate-100 transition-colors">
                                    Register as Donor
                                </Button>
                            </Link>
                        </FadeIn>

                        <div className="flex items-center gap-8 pt-8 border-t border-slate-100 text-slate-500">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <img key={i} className="w-10 h-10 rounded-full border-4 border-white transition-transform hover:scale-125 hover:z-10" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" />
                                ))}
                            </div>
                            <p className="text-sm font-medium">Joined by <span className="text-slate-900 font-bold">12,000+</span> heroes</p>
                        </div>
                    </div>

                    {/* Right Visuals */}
                    <div className="relative hidden md:block animate-in slide-in-from-right duration-1000 delay-200">
                        {/* Background Blob Animation */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
                        <div className="absolute top-0 right-40 w-[500px] h-[500px] bg-purple-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>

                        {/* Floating Card Interface */}
                        <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-500">

                            {/* Card Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Live Requests</h3>
                                    <p className="text-sm text-slate-500">Real-time emergency feed</p>
                                </div>
                                <div className="p-2 bg-white rounded-lg shadow-sm animate-pulse">
                                    <Activity size={20} className="text-brand-500" />
                                </div>
                            </div>

                            {/* List Items */}
                            <div className="space-y-4">
                                {[
                                    { bg: 'A+', loc: 'Apollo Hospital', dist: '0.8km', urgent: true },
                                    { bg: 'O-', loc: 'City Medical Center', dist: '2.5km', urgent: true },
                                    { bg: 'AB+', loc: 'General Ward', dist: '4.2km', urgent: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-brand-200 transition-all cursor-pointer group hover:shadow-md hover:-translate-x-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm ${item.urgent ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-600'}`}>
                                            {item.bg}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 group-hover:text-brand-700 transition-colors">{item.loc}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{item.dist}</span>
                                                {item.urgent && <span className="text-brand-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span> Critical</span>}
                                            </div>
                                        </div>
                                        <button className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </header>

            {/* STATS SECTION */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { val: 15000, label: 'Registered Donors' },
                            { val: 850, label: 'Verified Hospitals' },
                            { val: 3200, label: 'Lives Saved' },
                            { val: 120, label: 'Active Camps' }
                        ].map((stat, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <CountUp end={stat.val} label={stat.label} />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">How DonorLink Works</h2>
                        <p className="text-slate-600 mt-4">We've simplified the blood donation process. From registration to donation, it takes just a few steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: 'Register', desc: 'Create your profile in 2 minutes. We enable GPS to notify you only when needed nearby.' },
                            { icon: Activity, title: 'Get Notified', desc: 'Receive real-time alerts for emergency requests or blood donation camps in your area.' },
                            { icon: Heart, title: 'Donate & Save', desc: 'Visit the hospital or camp. Donate blood, save a life, and earn a "Life Saver" badge.' },
                        ].map((step, i) => (
                            <FadeIn key={i} delay={0.2 + (i * 0.2)}>
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group h-full">
                                    <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-brand-600 group-hover:text-white">
                                        <step.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;