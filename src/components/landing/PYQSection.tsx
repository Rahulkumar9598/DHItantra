import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PYQSection = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: "NEET PYQs",
            subtitle: "Medical Entrance Examination",
            items: ["Physics PYQs", "Chemistry PYQs", "Biology PYQs"],
            accent: "orange"
        },
        {
            title: "JEE PYQs",
            subtitle: "Engineering Entrance Examination",
            items: ["JEE Main PYQs", "JEE Advanced PYQs"],
            accent: "green"
        },
        {
            title: "SSC PYQs",
            subtitle: "Staff Selection Commission",
            items: ["CGL Previous Papers", "MTS Previous Papers", "CHSL Previous Papers"],
            accent: "blue" // Using blue to differentiate third card visually 
        }
    ];

    return (
        <section id="resources" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-bold uppercase tracking-wide mb-4">Free Resources</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Explore PYQs (Free)</h2>
                    <p className="text-blue-600 font-medium text-lg">
                        Access previous year questions to boost your preparation
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                            {/* Top Border Accent */}
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${card.accent === 'orange' ? 'bg-orange-500' :
                                card.accent === 'green' ? 'bg-green-500' : 'bg-blue-500'
                                }`}></div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                            <p className="text-sm text-gray-500 mb-6 font-medium">{card.subtitle}</p>

                            <ul className="space-y-3 mb-8">
                                {card.items.map((item, i) => (
                                    <li key={i} className="text-gray-600 flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${card.accent === 'orange' ? 'bg-orange-400' :
                                            card.accent === 'green' ? 'bg-green-400' : 'bg-blue-400'
                                            }`}></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                Explore PYQs <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PYQSection;
