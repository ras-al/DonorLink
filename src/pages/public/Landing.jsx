import { ArrowRight, Droplets, ShieldCheck, Activity, Users, Heart, Clock, MapPin, Award, CheckCircle2, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Footer from '../../components/layout/Footer';
import { TextReveal, FadeIn } from '../../components/common/TextReveal';
import GlitchText from '../../components/common/GlitchText';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

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

// --- NEW 3D COMPONENTS ---
const TiltCard = ({ children, className = "" }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ perspective: 1000 }}
            className={`relative ${className}`}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full rounded-3xl"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

const Floating3DElement = ({ delay = 0, duration = 8, className, children }) => (
    <motion.div
        animate={{
            y: [-20, 20, -20],
            rotateX: [0, 45, 0],
            rotateY: [0, 45, 0],
        }}
        transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className={`absolute shadow-xl flex items-center justify-center ${className}`}
        style={{ transformStyle: "preserve-3d", zIndex: 0 }}
    >
        {children}
    </motion.div>
);

const WarpSpeed = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center mix-blend-screen z-0">
        {[...Array(60)].map((_, i) => {
            const angle = Math.random() * 360;
            return (
                <motion.div
                    key={i}
                    className="absolute h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent origin-left rounded-full"
                    style={{ rotate: angle, width: `${100 + Math.random() * 300}px` }}
                    initial={{ opacity: 0, x: 50, scaleX: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 0], x: [50, 1500, 2000], scaleX: [0, 1, 3] }}
                    transition={{
                        duration: 0.6 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeIn"
                    }}
                />
            );
        })}
    </div>
);
// -------------------------

const Landing = () => {
    const [showIntro, setShowIntro] = useState(true);
    const [stats, setStats] = useState({
        total_donors: 0,
        verified_hospitals: 0,
        lives_saved: 0,
        active_camps: 0,
        recent_requests_list: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/blood/public-stats/');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Could not fetch public stats.");
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        // Wait longer for the cinematic 3D intro to finish
        const timer = setTimeout(() => setShowIntro(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900">

            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(20px)", scale: 1.2 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Sharp ease-out for futuristic feel
                        className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-center overflow-hidden"
                        style={{ perspective: 1200 }}
                    >
                        {/* Futuristic Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

                        {/* NEW WOW EFFECTS */}
                        <WarpSpeed />
                        <motion.div
                            initial={{ scale: 0, opacity: 1, borderWidth: "50px" }}
                            animate={{ scale: 40, opacity: 0, borderWidth: "1px" }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-brand-500 pointer-events-none mix-blend-screen z-0"
                        />
                        {/* ---------------- */}

                        {/* Orbiting Tech Rings */}
                        <motion.div
                            animate={{ rotateZ: 360, rotateX: [60, 60], rotateY: [0, 360] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[800px] h-[800px] border-[2px] border-brand-500/10 rounded-full"
                            style={{ transformStyle: "preserve-3d" }}
                        />
                        <motion.div
                            animate={{ rotateZ: -360, rotateX: [70, 70], rotateY: [360, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[600px] h-[600px] border-[1px] border-red-500/20 rounded-full border-dashed"
                            style={{ transformStyle: "preserve-3d" }}
                        />

                        {/* Glowing core */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                        {/* Central Holographic Logo Sequence */}
                        <motion.div
                            initial={{ rotateX: 60, scale: 0.5, y: 100, opacity: 0 }}
                            animate={{ rotateX: 0, scale: 1, y: 0, opacity: 1 }}
                            exit={{ rotateX: -60, scale: 0.8, y: -100, opacity: 0 }}
                            transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
                            className="text-center relative z-10 flex flex-col items-center"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <motion.div
                                className="relative w-36 h-36 rounded-[2rem] flex items-center justify-center mb-10 overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(220,38,38,0.25)]"
                                animate={{
                                    y: [0, -15, 0],
                                    rotateY: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Holographic scanline effect inside the logo container */}
                                <motion.div
                                    animate={{ top: ['-100%', '200%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-brand-400/30 to-transparent z-20 pointer-events-none mix-blend-overlay"
                                />

                                <img src="/logo.png" alt="DonorLink Logo" className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />

                                {/* Inner glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-transparent"></div>
                            </motion.div>

                            <motion.div className="flex flex-col items-center">
                                <motion.h1
                                    initial={{ opacity: 0, filter: "blur(20px)", y: 60, scale: 0.5 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
                                    transition={{ delay: 0.5, duration: 1, type: "spring", bounce: 0.6 }}
                                    className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400 tracking-tighter drop-shadow-[0_0_25px_rgba(220,38,38,0.7)]"
                                >
                                    DONOR<span className="text-brand-500">LINK</span>
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "120%" }}
                                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                                    className="h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent mt-4 mb-4 w-full max-w-[300px] shadow-[0_0_15px_rgba(220,38,38,1)]"
                                />

                                <motion.p
                                    initial={{ opacity: 0, filter: "blur(5px)" }}
                                    animate={{ opacity: [0, 1, 0.4, 1], filter: "blur(0px)", x: [-5, 5, -2, 0] }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                    className="text-brand-300 font-mono tracking-[0.4em] uppercase text-xs font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                >
                                    Sys. Initialized // Match Engine Online
                                </motion.p>
                            </motion.div>
                        </motion.div>

                        {/* Floating Tech Elements */}
                        <Floating3DElement delay={0.2} duration={5} className="top-[20%] left-[15%]">
                            <motion.div
                                animate={{ boxShadow: ["0 0 20px rgba(239,68,68,0.2)", "0 0 60px rgba(239,68,68,0.8)", "0 0 20px rgba(239,68,68,0.2)"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-20 h-20 rounded-xl border border-red-500/50 bg-red-500/10 backdrop-blur-md flex items-center justify-center transform rotate-12"
                            >
                                <Activity size={32} className="text-red-400" />
                            </motion.div>
                        </Floating3DElement>
                        <Floating3DElement delay={1} duration={6} className="bottom-[25%] right-[15%]">
                            <motion.div
                                animate={{ boxShadow: ["0 0 20px rgba(220,38,38,0.2)", "0 0 60px rgba(220,38,38,0.8)", "0 0 20px rgba(220,38,38,0.2)"] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                                className="w-24 h-24 rounded-full border border-brand-500/50 bg-brand-500/10 backdrop-blur-md flex items-center justify-center transform -rotate-12"
                            >
                                <ShieldCheck size={36} className="text-brand-400" />
                            </motion.div>
                        </Floating3DElement>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: showIntro ? -100 : 0, opacity: showIntro ? 0 : 1 }}
                transition={{ duration: 0.8, delay: showIntro ? 0 : 0.5, ease: "easeOut" }}
                className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100"
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-2xl tracking-tight">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 transition-transform hover:rotate-12 hover:scale-110 overflow-hidden bg-white">
                            <img src="/logo.png" alt="DonorLink Logo" className="w-full h-full object-cover" />
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
            </motion.nav>

            <motion.header
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.95 : 1 }}
                transition={{ duration: 1, delay: showIntro ? 0 : 0.8 }}
                className="relative pt-20 pb-32 overflow-hidden"
            >
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
                                <GlitchText text={
                                    stats.recent_requests_list.length > 0 && stats.recent_requests_list[0].urgent
                                        ? `URGENT: ${stats.recent_requests_list[0].bg} Donors needed in ${stats.recent_requests_list[0].loc.split(',')[0].substring(0, 15)}...`
                                        : "Join the community to save lives today"
                                } />
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

                        {stats.total_donors > 0 && (
                            <div className="flex items-center gap-8 pt-8 border-t border-slate-100 text-slate-500">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <img key={i} className="w-10 h-10 rounded-full border-4 border-white transition-transform hover:scale-125 hover:z-10" src={`https://ui-avatars.com/api/?name=Donor+${i}&background=f8fafc&color=0f172a`} alt="" />
                                    ))}
                                </div>
                                <p className="text-sm font-medium">Joined by <span className="text-slate-900 font-bold">{stats.total_donors.toLocaleString()}</span> heroes</p>
                            </div>
                        )}
                    </div>

                    {/* Right Visuals (3D Animated) */}
                    <div className="relative hidden md:block w-full h-full min-h-[500px]">
                        {/* 3D Floating Badges Background */}
                        <Floating3DElement delay={0} duration={6} className="top-10 -right-10 w-20 h-20 bg-brand-500 rounded-3xl rotate-12 backdrop-blur-md bg-opacity-90">
                            <Droplets size={36} className="text-white" />
                        </Floating3DElement>
                        <Floating3DElement delay={2} duration={7} className="bottom-20 -left-12 w-16 h-16 bg-red-500 rounded-2xl -rotate-12 backdrop-blur-md bg-opacity-90">
                            <Heart size={28} className="text-white fill-white" />
                        </Floating3DElement>
                        <Floating3DElement delay={1} duration={8} className="-top-5 left-10 w-14 h-14 bg-blue-500 rounded-full rotate-45 backdrop-blur-md bg-opacity-90">
                            <Activity size={24} className="text-white" />
                        </Floating3DElement>

                        {/* Interactive 3D Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.4 }}
                            className="absolute inset-0 flex items-center justify-center z-10"
                        >
                            <TiltCard className="w-full max-w-sm mx-auto">
                                <div className="bg-white/80 backdrop-blur-2xl border border-white/60 p-6 rounded-3xl shadow-2xl relative overflow-hidden h-full">
                                    {/* Inner 3D elements require transformZ to pop out */}
                                    <div
                                        className="relative z-20 h-full flex flex-col"
                                        style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">Live Requests</h3>
                                                <p className="text-sm text-slate-500">Real-time emergency feed</p>
                                            </div>
                                            <div className="p-2 bg-white rounded-lg shadow-md animate-pulse border border-slate-100">
                                                <Activity size={20} className="text-brand-500" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 flex-1">
                                            {stats.recent_requests_list.length > 0 ? stats.recent_requests_list.slice(0, 3).map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.8 + (i * 0.1) }}
                                                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                                                    style={{ transform: `translateZ(${40 - (i * 10)}px)` }}
                                                >
                                                    <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xl font-bold shadow-sm ${item.urgent ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
                                                        {item.bg}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-800 truncate" title={item.loc}>{item.loc.split(',')[0]}</h4>
                                                        {item.urgent && <span className="text-red-500 font-bold flex items-center gap-1 mt-0.5 text-[10px] uppercase tracking-wider"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Critical</span>}
                                                    </div>
                                                    <ArrowRight size={16} className="text-slate-300" />
                                                </motion.div>
                                            )) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-3">
                                                    <ShieldCheck size={32} className="text-green-500 opacity-50" />
                                                    <p className="text-sm font-medium">No active emergencies.<br />Community is safe.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Glowing orb inside card for depth */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 -z-10" style={{ transform: "translateZ(-20px)" }}></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 -z-10" style={{ transform: "translateZ(-20px)" }}></div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </div>

                </div>
            </motion.header>

            {/* STATS SECTION */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { val: stats.total_donors, label: 'Registered Donors' },
                            { val: stats.verified_hospitals, label: 'Verified Hospitals' },
                            { val: stats.lives_saved, label: 'Lives Saved' },
                            { val: stats.active_camps, label: 'Active Camps' }
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