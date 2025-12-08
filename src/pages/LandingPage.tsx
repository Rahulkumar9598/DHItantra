import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureSliderLike from '../components/landing/FeatureSliderLike';
import TestSeriesCard from '../components/landing/TestSeriesCard';
import PYQSection from '../components/landing/PYQSection';

const LandingPage = () => {

    return (
        <div className="font-sans antialiased bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <HeroSection />

            {/* Slider / Key Features Section */}
            <FeatureSliderLike />

            {/* Trending Series */}
            <section id="test-series" className="py-20 bg-blue-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-green-600 tracking-widest uppercase mb-2">Our Best Sellers</h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Trending Test Series</h3>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="mb-12">
                        <h4 className="flex items-center gap-3 text-xl font-bold text-blue-800 mb-6">
                            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                            IIT JEE Mock Test
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TestSeriesCard
                                title="IIT JEE Mains(Class-11th) - 2025"
                                isNew={true}
                                originalPrice="1000"
                                price="699"
                                features={[
                                    "300+ Questions",
                                    "Chapterwise & Unit Tests",
                                    "Scheduled Access",
                                    "Real Exam Interface"
                                ]}
                            />
                            <TestSeriesCard
                                title="IIT JEE mains(Class-12th) - 2025"
                                isNew={true}
                                originalPrice="1000"
                                price="499"
                                features={[
                                    "300+ Questions",
                                    "Full Mock Tests",
                                    "Access Scheduled",
                                    "Performance Analytics"
                                ]}
                            />
                        </div>
                    </div>

                    <div className="mb-12">
                        <h4 className="flex items-center gap-3 text-xl font-bold text-blue-800 mb-6">
                            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                            NEET UG Mock Test
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TestSeriesCard
                                title="Test series for NEET UG - 2026"
                                isNew={true}
                                originalPrice="1000"
                                price="699"
                                features={[
                                    "20 Full Mock Tests",
                                    "200+ Questions",
                                    "Access Scheduled",
                                    "Detailed Solutions"
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore PYQs */}
            <PYQSection />

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-tr from-orange-500 to-red-500 p-1.5 rounded-lg">
                                    <span className="text-white font-bold text-xl">E</span>
                                </div>
                                <span className="text-2xl font-bold text-white">Examinantt</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                The Future of Exam Prep. An AI-driven platform designed to help you succeed with precision and confidence.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Quick links</h3>
                            <ul className="space-y-3">
                                {['Test series security', 'Home', 'Test series', 'Free resources'].map(item => (
                                    <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Company</h3>
                            <ul className="space-y-3">
                                {['About Us', 'Public Notice', 'Management', 'Careers'].map(item => (
                                    <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Contact Us</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-center gap-2">✉️ support@examinantt.com</li>
                                <li className="flex items-center gap-2">📞 +91 800-1108-670</li>
                                <li>📍 Examinantt office, New Delhi, India</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-xs text-gray-500">
                            © 2024 Examinantt (OPC) PVT. LTD. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
