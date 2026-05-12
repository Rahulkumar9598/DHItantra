import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { getAllTestSeries } from '../services/testSeriesService';
import { classService } from '../services/classService';
import { subjectService } from '../services/subjectService';
import type { TestSeries } from '../types/test.types';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import AISimulationSection from '../components/landing/AISimulationSection';
// import PYQSection from '../components/landing/PYQSection';
import TestDevDept from '../components/landing/TestDevDept';
import SocialProof from '../components/landing/SocialProof';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import Footer from '../components/landing/Footer';
import TestSeriesCard from '../components/landing/TestSeriesCard';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');

    const fallbackTests = [
        {
            id: 'neet-ug-2026',
            name: 'NEET UG 2026 Series',
            examCategory: 'NEET',
            courseClass: 'Class 12',
            pricing: { type: 'paid', amount: 1299, currency: 'INR' },
            description: 'NEET UG ready series with NCERT-based practice, biology focus, and full syllabus mock tests.',
            features: [
                'NCERT-aligned theory coverage',
                'Biology-centric full tests',
                'Physics & Chemistry practice drills',
                'Performance analytics and review'
            ],
            testIds: [],
            createdBy: 'system',
            createdAt: { seconds: 0, nanoseconds: 0 } as any,
            updatedAt: { seconds: 0, nanoseconds: 0 } as any,
            status: 'published'
        },
        {
            id: 'jee-mains-2026',
            name: 'JEE Mains/Adv 2026 Series',
            examCategory: 'JEE',
            courseClass: 'Class 12',
            pricing: { type: 'paid', amount: 1499, currency: 'INR' },
            description: 'Advanced JEE preparation with full-length mock tests, chapter practice and ranking analytics.',
            features: [
                'NTA-style mock tests',
                'Chapter-wise problems',
                'Performance improvement insights',
                'Rank predictor reports'
            ],
            testIds: [],
            createdBy: 'system',
            createdAt: { seconds: 0, nanoseconds: 0 } as any,
            updatedAt: { seconds: 0, nanoseconds: 0 } as any,
            status: 'published'
        },
        {
            id: 'ssc-cgl-2026',
            name: 'SSC CGL 2026 Series',
            examCategory: 'SSC',
            courseClass: 'Class 12',
            pricing: { type: 'paid', amount: 999, currency: 'INR' },
            description: 'Prepare for SSC with full-length mocks, reasoning drills, and general awareness practice.',
            features: [
                'Quantitative Aptitude',
                'Reasoning & English',
                'General Awareness',
                'Full-length SSC Mocks'
            ],
            testIds: [],
            createdBy: 'system',
            createdAt: { seconds: 0, nanoseconds: 0 } as any,
            updatedAt: { seconds: 0, nanoseconds: 0 } as any,
            status: 'published'
        },
        {
            id: 'ssc-chsl-2026',
            name: 'SSC CHSL Crash Series',
            examCategory: 'SSC',
            courseClass: 'Class 12',
            pricing: { type: 'paid', amount: 799, currency: 'INR' },
            description: 'Fast-track SSC CHSL readiness with topic-wise practice and performance analytics.',
            features: [
                'Speed & Accuracy Drills',
                'General Awareness Boosters',
                'Reasoning Strategy Tests',
                'Score Improvement Insights'
            ],
            testIds: [],
            createdBy: 'system',
            createdAt: { seconds: 0, nanoseconds: 0 } as any,
            updatedAt: { seconds: 0, nanoseconds: 0 } as any,
            status: 'published'
        },
        {
            id: 'class-10-mcq-series',
            name: 'Class 10 MCQ Practice Series',
            examCategory: 'Class 10',
            courseClass: 'Class 10',
            pricing: { type: 'free', currency: 'INR' },
            description: 'Comprehensive MCQ practice for Class 10 Physics, Chemistry, and Mathematics with detailed explanations.',
            features: [
                'Physics, Chemistry & Maths MCQs',
                'Topic-wise Practice',
                'Detailed Solutions',
                'Progress Tracking'
            ],
            testIds: ['class10-physics-test', 'class10-chemistry-test', 'class10-maths-test'],
            createdBy: 'system',
            createdAt: { seconds: 0, nanoseconds: 0 } as any,
            updatedAt: { seconds: 0, nanoseconds: 0 } as any,
            status: 'published'
        }
    ] as TestSeries[];

    const getFallbackTests = () => {
        if (selectedCategory === 'SSC') {
            return fallbackTests.filter(item => item.examCategory === 'SSC');
        }

        if (selectedCategory === 'Class 10') {
            return fallbackTests.filter(item => item.courseClass === 'Class 10');
        }

        if (selectedCategory === 'Class 12') {
            if (selectedSubCategory === 'NEET') {
                return fallbackTests.filter(item => item.examCategory === 'NEET');
            }
            if (selectedSubCategory === 'JEE') {
                return fallbackTests.filter(item => item.examCategory === 'JEE');
            }
            return fallbackTests.filter(item => ['NEET', 'JEE'].includes(item.examCategory));
        }

        return [];
    };

    useEffect(() => {
        const fetchTestSeries = async () => {
            try {
                const data = await getAllTestSeries({ status: 'published' });
                setTestSeries(data);
            } catch (error) {
                console.error("Error fetching test series:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestSeries();
    }, []);

    const getCourseClass = (item: TestSeries) => {
        const explicit = String((item as any).courseClass || (item as any).className || '').trim();
        if (explicit) return explicit;

        const name = String(item.name || '').toLowerCase();
        if (name.includes('class 10') || name.includes('class10')) return 'Class 10';
        if (name.includes('class 12') || name.includes('class12')) return 'Class 12';
        return '';
    };

    const getExamCategory = (item: TestSeries) => String(item.examCategory || '').trim();

    // Dynamic Filter Logic for Test Series
    const filteredSeries = testSeries.filter((test) => {
        const seriesName = test.name || (test as any).title || '';
        const category = getExamCategory(test);
        const courseClass = getCourseClass(test);

        const matchesSearch = seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            courseClass.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = (() => {
            if (selectedCategory === 'All') return true;

            if (selectedCategory === 'Class 10') {
                return courseClass.toLowerCase().includes('10');
            }

            if (selectedCategory === 'Class 12') {
                const isClass12 = courseClass.toLowerCase().includes('12');
                const isJeeNeet = ['jee', 'neet'].includes(category.toLowerCase());
                if (!isClass12 && !isJeeNeet) return false;
                if (selectedSubCategory === 'All') return true;
                return category.toLowerCase() === selectedSubCategory.toLowerCase();
            }

            if (selectedCategory === 'SSC') {
                return category.toLowerCase() === 'ssc';
            }

            return false;
        })();

        return matchesSearch && matchesCategory;
    });

    const handleBuy = (seriesId: string) => {
        navigate(`/test-series/${seriesId}`);
    };

    const fallbackForCurrentSelection = getFallbackTests();
    let displayTests = filteredSeries;

    if (filteredSeries.length === 0) {
        displayTests = fallbackForCurrentSelection;
    } else if (selectedCategory === 'Class 12' && selectedSubCategory === 'All') {
        const existingIds = new Set(filteredSeries.map(test => test.id));
        const missingFallbacks = fallbackForCurrentSelection.filter((test) => !existingIds.has(test.id));
        displayTests = [...filteredSeries, ...missingFallbacks];
    }

    const scrollToTestSeries = () => {
        const el = document.getElementById('test-series');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-[#0D9488] selection:text-white relative min-h-screen">
            {/* Global Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-teal-100/30 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-50/30 blur-[120px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            </div>

            <div className="relative z-10">
                <Navbar />

            {/* 1 & 2. Hero & Banner Section */}
            <HeroSection onGetStarted={scrollToTestSeries} />

            <LeaderboardSection />

            {/* 3. Test Series Section (Moved up) */}
            <section id="test-series" className="relative py-6 scroll-mt-24">

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                        <div>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Explore Test Series</h3>
                            <p className="text-slate-500 mt-1 font-medium italic">Hand-picked premium series for your success.</p>
                        </div>
                        <div className="flex flex-col gap-4 w-full lg:w-auto">
                            <div className="flex flex-wrap items-center gap-3">
                                {[
                                    { label: 'All Categories', value: 'All' },
                                    { label: 'Class 10', value: 'Class 10' },
                                    { label: 'Class 12', value: 'Class 12' },
                                    { label: 'SSC Exams', value: 'SSC' }
                                ].map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => {
                                            setSelectedCategory(item.value);
                                            setSelectedSubCategory('All');
                                        }}
                                        className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === item.value ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-200 hover:text-teal-600'}`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {selectedCategory === 'Class 12' && (
                                <div className="flex flex-wrap items-center gap-3">
                                    {[
                                        { label: 'All Class 12', value: 'All' },
                                        { label: 'NEET UG', value: 'NEET' },
                                        { label: 'JEE Mains/Adv', value: 'JEE' }
                                    ].map((item) => (
                                        <button
                                            key={item.value}
                                            onClick={() => setSelectedSubCategory(item.value)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedSubCategory === item.value ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-200 hover:text-teal-600'}`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex-1 sm:w-80">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Find your goal..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-3 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-semibold shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CONTENT */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#0D9488]"></div>
                        </div>
                    ) : displayTests.length > 0 ? (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {displayTests.map((series, index) => {
                                const isFree = series.pricing?.type === 'free' || !series.pricing?.amount || series.pricing.amount === 0;
                                const actionButton = (
                                    <button
                                        onClick={() => handleBuy(series.id)}
                                        className="w-full relative group/btn h-16 rounded-3xl bg-slate-900 hover:bg-teal-600 shadow-2xl shadow-slate-900/10 active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                        <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em]">
                                            {isFree ? 'Enroll for Free' : `Access Now for ₹${series.pricing.amount}`}
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                                        </span>
                                        <div className="absolute inset-0 bg-linear-to-r from-teal-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                    </button>
                                );

                                return (
                                    <motion.div
                                        key={series.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="h-full"
                                    >
                                        <TestSeriesCard
                                            title={series.name}
                                            description={series.description}
                                            examCategory={series.examCategory}
                                            price={series.pricing.type === 'paid' ? (series.pricing.amount ?? 0) : 'Free'}
                                            originalPrice={series.pricing.type === 'paid' ? (series.pricing.amount ?? 0) * 1.5 : 0}
                                            testCount={series.testIds?.length || 0}
                                            isNew={index === 0}
                                            actions={actionButton}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>

                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-slate-500 text-sm font-semibold">
                                No test series available for the selected criteria.
                            </p>
                        </div>
                    )}
                </div>
            </section>

           

            {/* AI Analysis and Real Exam Simulation Demo (Moved down) */}
            <AISimulationSection />

            {/* 5. Test development Dept */}
            <TestDevDept />

            {/* 6. Social Proof & Final CTA */}
            <SocialProof />

            {/* 7. Footer */}
            <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
