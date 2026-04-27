import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTestSeries } from '../services/testSeriesService';
import type { TestSeries } from '../types/test.types';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import AISimulationSection from '../components/landing/AISimulationSection';
import PYQSection from '../components/landing/PYQSection';
import TestDevDept from '../components/landing/TestDevDept';
import SocialProof from '../components/landing/SocialProof';
import Footer from '../components/landing/Footer';
// sdfsd
const LandingPage = () => {
    const navigate = useNavigate();
    const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<'11' | '12' | 'both'>('11');
    const [selectedSubject, setSelectedSubject] = useState('Physics');

    const subjectOptionsByClass: Record<'11' | '12' | 'both', string[]> = {
        '11': ['Physics', 'Chemistry', 'Mathematics'],
        '12': ['Physics', 'Chemistry', 'Mathematics'],
        'both': ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    };

    useEffect(() => {
        const availableSubjects = subjectOptionsByClass[selectedClass];
        if (!availableSubjects.includes(selectedSubject)) {
            setSelectedSubject(availableSubjects[0]);
        }
    }, [selectedClass]);

    const courseCatalog = [
        {
            id: 'course-1',
            title: 'JEE Physics Mastery',
            category: 'JEE',
            classLevel: '11',
            subject: 'Physics',
            description: 'Complete class 11 physics course for concept clarity and mock practice.',
            price: 'Free',
        },
        {
            id: 'course-2',
            title: 'NEET Chemistry Booster',
            category: 'NEET',
            classLevel: '11',
            subject: 'Chemistry',
            description: 'Focused chemistry drills and revision for NEET aspirants.',
            price: '₹299',
        },
        {
            id: 'course-3',
            title: 'JEE Mathematics Advance',
            category: 'JEE',
            classLevel: '12',
            subject: 'Mathematics',
            description: 'High-yield problems and timed practice for class 12 maths.',
            price: '₹349',
        },
        {
            id: 'course-4',
            title: 'NEET Biology Revision',
            category: 'NEET',
            classLevel: '12',
            subject: 'Biology',
            description: 'Botany and Zoology full revision with exam-style questions.',
            price: '₹299',
        },
    ];

    const filteredCourses = courseCatalog.filter((course) => {
        const classMatch = selectedClass === 'both' || course.classLevel === selectedClass;
        const subjectMatch = course.subject === selectedSubject;
        return classMatch && subjectMatch;
    });

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

            {/* 2a. Class → Subject → Course Finder */}
            <section className="py-16 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#1D64D0] bg-blue-100 px-3 py-1 rounded-full">
                            Course Selector
                        </span>
                        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Choose Class, Pick Subject, Find Courses
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                            Select your class first, then a subject to reveal the best exam-ready course options with category labels.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[280px_minmax(0,1fr)] items-end mb-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Select Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value as '11' | '12' | 'both')}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="11">Class 11</option>
                                <option value="12">Class 12</option>
                                <option value="both">Class 11 + 12</option>
                            </select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700">Select Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    {subjectOptionsByClass[selectedClass].map((subject) => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {filteredCourses.length > 0 ? (
                            Array.from(new Set(filteredCourses.map((course) => course.category))).map((category) => (
                                <span
                                    key={category}
                                    className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1D64D0]"
                                >
                                    {category}
                                </span>
                            ))
                        ) : (
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">
                                No courses available for selected subject.
                            </span>
                        )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{course.subject}</p>
                                        <h3 className="mt-2 text-xl font-bold text-slate-900">{course.title}</h3>
                                    </div>
                                    <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D64D0]">
                                        {course.category}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-6">{course.description}</p>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-lg font-bold text-slate-900">{course.price}</span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                                        Class {course.classLevel}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. AI Analysis and Real Exam Simulation Demo */}
            <AISimulationSection />

            {/* 3. Trending Test series / PYQs (Resources) */}
            <PYQSection />

            {/* Trending Series */}
            {/* <section id="test-series" className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#1D64D0] tracking-widest uppercase mb-2 block">Trending Products</span>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-[#0B4F97]">Test Series</h3>
                        <div className="w-20 h-1.5 bg-[#1D64D0] mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D64D0]"></div>
                            </div>
                        ) : testSeries.length > 0 ? (
                            testSeries.map((series) => (
                                <TestSeriesCard
                                    key={series.id}
                                    title={series.name}
                                    isNew={true}
                                    originalPrice={series.pricing.type === 'paid' ? `${(series.pricing.amount || 0) * 1.5}` : '0'}
                                    price={series.pricing.type === 'paid' ? `${series.pricing.amount}` : 'Free'}
                                    features={series.description ? [series.description] : []}
                                    onExplore={() => handleBuy(series.id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 py-12">
                                <p>No test series available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section> */}
 <section id="test-series" className="py-24 bg-[#F8FAFC] scroll-mt-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* HEADER */}
    <div className="text-center mb-20">
      <span className="inline-block text-xs font-semibold text-[#1D64D0] bg-[#1D64D0]/10 px-4 py-1.5 rounded-full tracking-wide mb-4">
        Practice & Preparation
      </span>

      <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900">
        Test Series
      </h3>

      <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm md:text-base">
        Practice with curated mock tests designed to boost your exam performance and confidence.
      </p>

      <div className="w-16 h-1 bg-[#1D64D0] mx-auto mt-6 rounded-full"></div>
    </div>

    {/* CONTENT */}
    {loading ? (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#1D64D0]"></div>
      </div>
    ) : testSeries.length > 0 ? (

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testSeries.map((series) => (
          
          <div
            key={series.id}
            className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
          
            {/* Top badges */}
            <div className="flex justify-between items-center px-5 pt-5">
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                New
              </span>

              <span className="text-xs text-gray-500 font-medium">
                Test Series
              </span>
            </div>

            {/* Title */}
            <div className="px-5 mt-3">
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#1D64D0] transition">
                {series.name}
              </h4>
            </div>

            {/* Description */}
            <div className="px-5 mt-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {series.description || "Practice with high-quality mock tests and detailed solutions."}
              </p>
            </div>

            {/* Features */}
            <div className="px-5 mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="text-[#1D64D0]">✓</span> Detailed Solutions
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#1D64D0]">✓</span> All India Ranking
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#1D64D0]">✓</span> Performance Analytics
              </p>
            </div>

            {/* Price */}
            <div className="px-5 mt-6 flex items-center gap-3">
              {series.pricing.type === "paid" ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{series.pricing.amount}
                  </span>

                  <span className="text-sm text-gray-400 line-through">
                    ₹{(series.pricing.amount || 0) * 1.5}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-green-600">
                  Free
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="p-5 mt-4">
              <button
                onClick={() => handleBuy(series.id)}
                className="w-full bg-[#1D64D0] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition"
              >
                Explore Test Series
              </button>
            </div>

          </div>

        ))}
      </div>

    ) : (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 text-sm">
          No test series available at the moment.
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
