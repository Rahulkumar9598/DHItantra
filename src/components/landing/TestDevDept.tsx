import { ShieldCheck, TrendingUp, Search, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TestDevDept = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth() || {};

    const handleProtectedNavigation = (path: string) => {
        if (currentUser) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    return (
        <section className="py-8 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-10 px-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0F766E] mb-3">Meet the Minds Behind Every Test</h2>
                    <p className="text-sm text-slate-500 max-w-2xl mx-auto mb-6">
                        Engineered with precision. Reviewed with responsibility. Designed for real exams.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-100">
                        <p className="text-[11px] font-bold text-slate-600 leading-relaxed max-w-xl">
                            Every test is built by a dedicated development system — not random question selection.
                            Our process combines subject expertise, exam trend analysis, and data validation.
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        {
                            title: "Subject Expert Team",
                            icon: <Search className="text-teal-500" size={18} />,
                            points: ["NCERT & syllabus alignment", "Concept-wise difficulty tagging", "Balanced distribution of questions"]
                        },
                        {
                            title: "Exam Pattern Analysts",
                            icon: <TrendingUp className="text-green-500" size={18} />,
                            points: ["Past year paper analysis", "Difficulty level calibration", "Section-wise weightage planning"]
                        },
                        {
                            title: "Multi-Level Quality Review",
                            icon: <ShieldCheck className="text-[#0D9488]" size={18} />,
                            points: ["Draft -> Review -> Error Check", "Ensuring clarity & fairness", "No ambiguous questions"]
                        },
                        {
                            title: "Data Validation Team",
                            icon: <UserCheck className="text-purple-500" size={18} />,
                            points: ["Structure & timing verification", "Question balance checks", "OMR compatibility validation"]
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 hover:border-teal-100 transition-all group shadow-sm">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-slate-100">
                                {item.icon}
                            </div>
                            <h3 className="text-sm font-bold text-[#0F766E] mb-4 leading-tight">{item.title}</h3>
                            <ul className="space-y-2">
                                {item.points.map((p, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-teal-300 mt-1.5 shrink-0"></div>
                                        <span className="text-[10px] font-bold text-slate-500 leading-tight">{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
                        {[
                            "Syllabus-Aligned Tests",
                            "Exam-Pattern Accurate",
                            "Multi-Stage Quality Checks",
                            "Designed for Rank Improvement"
                        ].map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-[#0F766E] font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
                                <ShieldCheck size={14} className="text-green-500 shrink-0" />
                                {b}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button 
                            onClick={() => handleProtectedNavigation('/resources')}
                            className="px-6 py-3 bg-[#0F766E] text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-sm w-full sm:w-auto"
                        >
                            View Sample Test Paper
                        </button>
                        <button 
                            onClick={() => handleProtectedNavigation('/test-series')}
                            className="px-6 py-3 bg-white text-[#0F766E] border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all w-full sm:w-auto"
                        >
                            Try a Demo Test (Free)
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TestDevDept;
