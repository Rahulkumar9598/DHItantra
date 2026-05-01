import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTestSeries } from '../services/testSeriesService';
import { classService } from '../services/classService';
import { subjectService } from '../services/subjectService';
import type { TestSeries } from '../types/test.types';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import AISimulationSection from '../components/landing/AISimulationSection';
import PYQSection from '../components/landing/PYQSection';
import TestDevDept from '../components/landing/TestDevDept';
import SocialProof from '../components/landing/SocialProof';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import Footer from '../components/landing/Footer';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Dynamic Filtering State
    const [availableClasses, setAvailableClasses] = useState<string[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [classesData, subjectsData] = await Promise.all([
                    classService.getAll(),
                    subjectService.getAll()
                ]);
                setAvailableClasses(classesData.map(c => c.name));
                setAvailableSubjects(subjectsData.map(s => s.name));
            } catch (error) {
                console.error("Error fetching metadata:", error);
            }
        };

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

        fetchMetadata();
        fetchTestSeries();
    }, []);

    const normalizeText = (value: unknown) => String(value ?? '').trim().toLowerCase();
    const getCourseClass = (item: TestSeries) => (item as any).courseClass || (item as any).className || '';
    const getSubject = (item: TestSeries) => (item as any).subject || (item as any).subjectName || '';

    // Dynamic Filter Logic for Test Series
    const filteredSeries = testSeries.filter((item) => {
        if (!selectedClass && !selectedSubject) return true;
        
        const matchesClass = !selectedClass || getCourseClass(item) === selectedClass;
        const matchesSubject = !selectedSubject || normalizeText(getSubject(item)) === normalizeText(selectedSubject);
        
        return matchesClass && matchesSubject;
    });

    const handleBuy = (seriesId: string) => {
        navigate(`/test-series/${seriesId}`);
    };

    const scrollToTestSeries = () => {
        const el = document.getElementById('test-series');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="font-sans antialiased bg-white text-slate-900 selection:bg-[#1D64D0] selection:text-white">
            <Navbar />

            {/* 1 & 2. Hero & Banner Section */}
            <HeroSection onGetStarted={scrollToTestSeries} />

            <LeaderboardSection />

            {/* 4. AI Analysis and Real Exam Simulation Demo */}
            <AISimulationSection />

            {/* 3. Trending Test series / PYQs (Resources) */}
            <PYQSection />

            {/* Test Series Section */}
            <section id="test-series" className="relative overflow-hidden py-24 bg-slate-50/30 scroll-mt-24">
                {/* Premium Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                    <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/30 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-100/30 blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* HEADER */}
                    <div className="text-center mb-16 md:mb-20">
                        <span className="inline-block text-xs font-semibold text-[#1D64D0] bg-[#1D64D0]/10 px-4 py-1.5 rounded-full tracking-wide mb-4">
                            Practice & Preparation
                        </span>

                        <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900">
                            Explore Our Test Series
                        </h3>

                        <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm md:text-base">
                            Practice with curated mock tests designed to boost your exam performance and confidence.
                        </p>

                        <div className="w-16 h-1 bg-gradient-to-r from-[#1D64D0] to-indigo-600 mx-auto mt-6 rounded-full"></div>
                    </div>

                    {/* Premium Filter Section */}
                    <div className="relative mb-20 z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/50 shadow-2xl p-8 md:p-10"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                <div className="w-full lg:w-1/3">
                                    <h4 className="text-xl font-black text-slate-900 mb-2">Find Your Course</h4>
                                    <p className="text-sm text-slate-500 font-medium">Filter by class and subject to find the perfect test series for you.</p>
                                </div>
                                
                                <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Class</label>
                                        <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setSelectedClass('')}
                                                    className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 border ${
                                                        selectedClass === '' 
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105' 
                                                        : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50'
                                                    }`}
                                                >
                                                    All Classes
                                                </button>
                                                {availableClasses.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setSelectedClass(c)}
                                                        className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 border ${
                                                            selectedClass === c 
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105' 
                                                            : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        Class {c}
                                                    </button>
                                                ))}
                                            {availableClasses.length === 0 && (
                                                <div className="text-slate-300 text-sm italic py-2">Loading classes...</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-64 space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Subject</label>
                                        <div className="relative group">
                                            <select
                                                value={selectedSubject}
                                                onChange={(e) => setSelectedSubject(e.target.value)}
                                                disabled={!selectedClass}
                                                className="w-full appearance-none rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm px-5 py-3.5 text-slate-800 font-bold focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group-hover:border-blue-200"
                                            >
                                                <option value="">{selectedClass ? 'All Subjects' : 'Select class first'}</option>
                                                {availableSubjects.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* CONTENT */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#1D64D0]"></div>
                        </div>
                    ) : filteredSeries.length > 0 ? (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {filteredSeries.map((series, index) => (
                                <motion.div
                                    key={series.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative flex flex-col bg-white/70 backdrop-blur-lg border border-white/40 rounded-[40px] shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Top Accent Line */}
                                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Badge Header */}
                                    <div className="flex justify-between items-center px-8 pt-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                                                {series.status === 'published' ? 'Active Now' : 'Upcoming'}
                                            </span>
                                        </div>

                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200/50">
                                            {series.examCategory || 'Academic'}
                                        </span>
                                    </div>

                                    {/* Content Area */}
                                    <div className="px-8 mt-8 flex-grow">
                                        <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                                            {series.name}
                                        </h4>
                                        <p className="mt-4 text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">
                                            {series.description || "Master your subjects with our comprehensive mock tests and detailed performance analytics."}
                                        </p>
                                    </div>

                                    {/* Features / Stats Placeholder */}
                                    <div className="px-8 mt-6 flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                    {String.fromCharCode(64 + i)}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            8.5k+ Students enrolled
                                        </span>
                                    </div>

                                    {/* Pricing & CTA */}
                                    <div className="p-8 mt-auto">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment</span>
                                                {series.pricing.type === "paid" ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-3xl font-black text-slate-900">&#8377;{series.pricing.amount}</span>
                                                        <span className="text-sm text-slate-400 line-through font-bold">&#8377;{(series.pricing.amount || 0) * 1.5}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-3xl font-black text-emerald-500">Free</span>
                                                )}
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleBuy(series.id)}
                                            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            Explore Test Series
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
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

            {/* 5. Test development Dept */}
            <TestDevDept />

            {/* 6. Social Proof & Final CTA */}
            <SocialProof />

            {/* 7. Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
