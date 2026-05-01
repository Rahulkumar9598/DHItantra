// import { useNavigate } from 'react-router-dom';
// import { ArrowRight, CheckCircle, Star } from 'lucide-react';

// const HeroSection = () => {
//     const navigate = useNavigate();

//     return (
//         <section className="relative min-h-screen flex flex-col lg:block overflow-hidden bg-white pt-16 lg:pt-20">
//             {/* Background Split Decor - Only for Desktop */}
//             <div className="absolute inset-0 hidden lg:flex flex-row">
//                 <div className="w-[42%] bg-[#0B4F97] relative h-full">
//                     <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
//                         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] border-[40px] border-white rounded-full blur-[100px]"></div>
//                     </div>
//                 </div>
//                 <div className="w-[58%] bg-white h-full"></div>
//             </div>

//             <div className="max-w-7xl mx-auto lg:px-8 relative z-10 w-full flex-grow flex flex-col lg:block">
//                 <div className="grid lg:grid-cols-12 flex-grow">

//                     {/* Left Banner Content (Navy on Mobile, Overlay on Desktop) */}
//                     <div className="lg:col-span-5 bg-[#0B4F97] lg:bg-transparent text-white px-4 sm:px-6 py-12 lg:py-20 lg:pr-12">
//                         {/* Redundant Logo removed on mobile, kept on desktop for split layout feel */}


//                         <div className="space-y-6 lg:space-y-8">
//                             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">
//                                 An AI-Powered <br />
//                                 <span className="text-blue-300">Semi-Offline</span> <br />
//                                 Mock Test Platform
//                             </h2>

//                             <p className="text-blue-100/80 text-base lg:text-lg max-w-sm leading-relaxed">
//                                 Practice online. Mark on real OMR sheets. <br className="hidden sm:block" />
//                                 <span className="text-white font-semibold">Get AI-driven performance analysis.</span>
//                             </p>

//                             <ul className="space-y-3 lg:space-y-4 pt-2 lg:pt-4">
//                                 {[
//                                     "Real Exam-Like OMR Practice",
//                                     "Time-Scheduled Mock Tests",
//                                     "Expert-Curated Question Papers",
//                                     "Smart Performance & Mistake Analysis"
//                                 ].map((item, i) => (
//                                     <li key={i} className="flex items-start gap-3 text-sm font-medium group text-blue-50/90">
//                                         <div className="bg-blue-400/20 p-1 rounded-full group-hover:bg-blue-400/40 transition-colors">
//                                             <CheckCircle size={14} className="text-blue-300 shrink-0" />
//                                         </div>
//                                         <span className="pt-0.5">{item}</span>
//                                     </li>
//                                 ))}
//                             </ul>

//                             <div className="pt-6 lg:pt-10">
//                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-4 opacity-70">Prepared for:</p>
//                                 <div className="flex gap-3 sm:gap-4">
//                                     {['NEET', 'JEE', 'SSC'].map(cat => (
//                                         <span key={cat} className="px-4 lg:px-5 py-2 bg-white/10 rounded-xl text-[10px] sm:text-xs font-black backdrop-blur-md border border-white/10 tracking-widest uppercase hover:bg-white/20 hover:scale-105 transition-all cursor-default">
//                                             {cat}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Content Area (White background) */}
//                     <div className="lg:col-span-7 bg-white px-4 sm:px-6 py-12 lg:py-20 lg:pl-10">
//                         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-[#1D64D0] uppercase tracking-[0.2em] mb-6 lg:mb-8">
//                             Next Gen Testing Environment
//                         </div>

//                         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-[#0B4F97] leading-[1.1] mb-6 lg:mb-8 tracking-tighter">
//                             Practice That <br className="hidden sm:block" />
//                             Makes You <br className="hidden sm:block" />
//                             <span className="text-[#1D64D0] relative inline-block">
//                                 Exam-Ready.
//                                 <div className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-1.5 lg:h-2 bg-blue-100 -z-10 rounded-full"></div>
//                             </span>
//                         </h1>

//                         <p className="text-lg lg:text-xl text-slate-500 mb-8 lg:mb-10 max-w-xl font-medium leading-relaxed">
//                             Not Just Test-Ready. We bridge the gap between simple practice and the high-pressure environment of the real exam.
//                         </p>

//                         <div className="flex flex-col sm:flex-row gap-4 lg:gap-5 mb-12 lg:mb-16">
//                             <button
//                                 onClick={() => navigate('/signup')}
//                                 className="px-8 lg:px-10 py-4 lg:py-5 bg-[#1D64D0] hover:bg-blue-700 text-white rounded-[15px] lg:rounded-[20px] font-black text-lg lg:text-xl shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 group"
//                             >
//                                 Get Started
//                                 <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
//                             </button>
//                             <button
//                                 className="px-8 lg:px-10 py-4 lg:py-5 bg-white text-[#1D64D0] border-2 border-[#1D64D0] rounded-[15px] lg:rounded-[20px] font-black text-lg lg:text-xl hover:bg-blue-50 transition-all flex items-center justify-center active:scale-95"
//                             >
//                                 Try Demo Test (Free)
//                             </button>
//                         </div>

//                         <div className="flex items-center gap-6 lg:gap-8 pt-8 lg:pt-10 border-t border-slate-100 flex-wrap">
//                             <div className="flex -space-x-3 lg:-space-x-4">
//                                 {[1, 2, 3, 4, 5].map(i => (
//                                     <div key={i} className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-[2px] lg:border-[3px] border-white bg-slate-100 shadow-lg overflow-hidden ring-1 ring-slate-100 transition-transform hover:-translate-y-1 hover:z-10 cursor-pointer">
//                                         <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
//                                     </div>
//                                 ))}
//                                 <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-[2px] lg:border-[3px] border-white bg-[#1D64D0] flex items-center justify-center text-[10px] lg:text-xs font-bold text-white shadow-lg">
//                                     +10k
//                                 </div>
//                             </div>
//                             <div>
//                                 <div className="flex text-yellow-400 mb-0.5 lg:mb-1">
//                                     {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="lg:size-[18px]" fill="currentColor" />)}
//                                 </div>
//                                 <p className="text-[10px] lg:text-sm text-slate-500 font-bold uppercase tracking-wider">
//                                     Trusted by <span className="text-[#0B4F97] font-black">10,000+</span> Aspirants
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HeroSection;
// ---------------------------------------------------------------------------------------------
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

type HeroSectionProps = {
    onGetStarted?: () => void;
};

const features = [
    'Real Exam-Like OMR Practice',
    'Time-Scheduled Mock Tests',
    'Expert-Curated Question Papers',
    'Smart Performance & Mistake Analysis',
];

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (onGetStarted) return onGetStarted();
        navigate('/signup');
    };

    return (
        <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 hidden lg:flex">
                <div className="w-[42%] bg-[#0B4F97] relative h-full">
                    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] border-40 border-white rounded-full blur-[100px]"></div>
                    </div>
                </div>
                <div className="w-[58%] bg-white h-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 min-h-screen">
                    <div className="lg:col-span-5 bg-[#0B4F97] text-white px-6 sm:px-8 py-14 lg:py-24 flex items-center">
                        <div className="max-w-xl">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                                An AI-Powered <br />
                                <span className="text-blue-300">Semi-Offline</span> <br />
                                Mock Test Platform
                            </h2>

                            <p className="text-blue-100/90 text-base sm:text-lg max-w-xl mt-6 leading-relaxed">
                                Practice online. Mark on real OMR sheets. <br className="hidden sm:block" />
                                <span className="text-white font-semibold">Get AI-driven performance analysis.</span>
                            </p>

                            <ul className="space-y-3 mt-8">
                                {features.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-blue-100/90 font-medium">
                                        <div className="p-1 rounded-full bg-white/10 mt-1">
                                            <CheckCircle size={16} className="text-blue-200" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4 opacity-80">
                                    Prepared for:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {['NEET', 'JEE', 'SSC'].map((exam) => (
                                        <span
                                            key={exam}
                                            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm font-black uppercase tracking-widest"
                                        >
                                            {exam}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-white px-6 sm:px-8 py-14 lg:py-24 flex flex-col justify-center">
                        <div className="max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#1D64D0] mb-6">
                                Next Gen Testing Environment
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0B4F97] leading-tight tracking-tight mb-6">
                                Practice That <br className="hidden sm:block" />
                                Makes You <br className="hidden sm:block" />
                                <span className="text-[#1D64D0] relative inline-flex">
                                    Exam-Ready.
                                    <span className="absolute -bottom-1 left-0 w-full h-2 bg-blue-100 rounded-full -z-10"></span>
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mb-10">
                                Not just test-ready. We bridge the gap between simple practice and the high-pressure environment of the real exam.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-14">
                                <button
                                    onClick={handleGetStarted}
                                    className="w-full sm:w-auto px-8 py-4 bg-[#1D64D0] hover:bg-blue-700 text-white rounded-[15px] font-black text-lg transition-all"
                                >
                                    Get Started
                                    <ArrowRight size={20} className="inline-block ml-2" />
                                </button>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-[#1D64D0] text-[#1D64D0] rounded-[15px] font-black text-lg hover:bg-blue-50 transition-all">
                                    Try Demo Test (Free)
                                </button>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-100">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <img
                                                    key={i}
                                                    src={`https://i.pravatar.cc/100?u=${i}`}
                                                    alt="user"
                                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                                />
                                            ))}
                                            <div className="w-10 h-10 rounded-full bg-[#1D64D0] text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                                                +10k
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-[0.15em] mt-1">
                                                Trusted by <span className="text-[#0B4F97]">10,000+</span> Aspirants
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-xs sm:text-sm bg-white px-3 py-2 rounded-full text-slate-600 border border-slate-200">
                                        Next Gen Testing Environment
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
