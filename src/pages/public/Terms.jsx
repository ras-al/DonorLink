
import Footer from '../../components/layout/Footer';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="max-w-4xl mx-auto px-6 py-12 flex-1">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 font-medium">
                    <ChevronLeft size={20} /> Back to Home
                </Link>

                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
                    <p className="text-slate-500 mb-8">Last updated: January 23, 2026</p>

                    <div className="space-y-6 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing and using DonorLink, you accept and agree to be bound by the terms and provision of this agreement.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">2. User Conduct</h2>
                            <p>Users are prohibited from using the platform for any illegal activities. False information regarding blood donation eligibility is strictly prohibited and accounts may be banned.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Medical Disclaimer</h2>
                            <p>DonorLink facilitates connections between donors and recipients but does not provide medical advice. Always consult with a qualified healthcare provider for medical concerns.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Privacy</h2>
                            <p>Your use of the site is also subject to our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default Terms;
