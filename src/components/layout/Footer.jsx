
import { Droplets, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
                            <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center">
                                <Droplets size={24} fill="currentColor" />
                            </div>
                            DonorLink
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Connecting donors, hospitals, and organizations to save lives.
                            Our AI-powered platform ensures blood reaches those in need, instantly.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-colors"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-colors"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Platform</h4>
                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/find-donor" className="hover:text-white transition-colors">Find Donors</Link></li>
                            <li><Link to="/camps" className="hover:text-white transition-colors">Donation Camps</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Success Stories</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Legal & Policy</h4>
                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                            <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
                        </ul>
                    </div>

                    {/* App Download */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Get the App</h4>
                        <p className="text-slate-400 text-sm mb-4">Stay connected on the go. Download our mobile app.</p>
                        <div className="space-y-3">
                            <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors">
                                <span className="font-bold text-xs">Download on the <br /><span className="text-base">App Store</span></span>
                            </button>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors">
                                <span className="font-bold text-xs">Get it on <br /><span className="text-base">Google Play</span></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 DonorLink Foundation. All rights reserved.</p>
                    <p className="flex items-center gap-1">Made with <Heart size={12} className="text-red-500 fill-red-500" /> for humanity.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
