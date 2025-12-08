import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const PYQSection = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: "NEET PYQs",
            subtitle: "Medical Entrance Examination",
            items: ["Physics 2018-2023", "Chemistry 2018-2023", "Biology 2018-2023"],
        },
        {
            title: "JEE PYQs",
            subtitle: "Engineering Entrance Examination",
            items: ["JEE Main 2019-2024", "JEE Advanced 2019-2023"],
        },
        {
            title: "SSC PYQs",
            subtitle: "Staff Selection Commission",
            items: ["CGL Tier I & II", "CHSL Previous Papers", "MTS Exam Papers"],
        }
    ];

    return (
        <section id="resources" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4">Free Access</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Previous Year Questions</h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Download and practice with authentic previous year papers. No subscription required.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen size={24} />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                            <p className="text-sm text-slate-500 mb-8">{card.subtitle}</p>

                            <ul className="space-y-3 mb-8">
                                {card.items.map((item, i) => (
                                    <li key={i} className="text-slate-600 flex items-center gap-3 text-sm font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Download PDF <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PYQSection;
