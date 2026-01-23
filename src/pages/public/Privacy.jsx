
import Footer from '../../components/layout/Footer';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="max-w-4xl mx-auto px-6 py-12 flex-1">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 font-medium">
                    <ChevronLeft size={20} /> Back to Home
                </Link>

                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
                    <p className="text-slate-500 mb-8">Last updated: January 23, 2026</p>

                    <div className="space-y-6 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us, such as your name, email address, phone number, blood type, and location when you register.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Information</h2>
                            <p>We use the information we collect to operate, maintain, and provide the features of the Service, including matching donors with recipients.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Sharing of Information</h2>
                            <p>We do not share your personal information with third parties without your consent, except as described in this policy (e.g., to Hospitals in emergency situations).</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Security</h2>
                            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default Privacy;
