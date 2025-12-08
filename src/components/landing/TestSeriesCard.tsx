import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

interface TestSeriesProps {
    title: string;
    isNew?: boolean;
    features: string[];
    originalPrice: string;
    price: string;
}

const TestSeriesCard = ({ title, isNew, features, originalPrice, price }: TestSeriesProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group">
            {isNew && (
                <span className="absolute top-6 right-6 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
                    New Arrival
                </span>
            )}

            <div className="mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    📝
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug min-h-[3rem]">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 mt-2">Comprehensive test preparation</p>
            </div>

            <div className="flex items-baseline gap-2 mb-8 border-b border-slate-100 pb-8">
                <span className="text-4xl font-extrabold text-slate-900">₹{price}</span>
                <span className="text-slate-400 line-through text-lg">₹{originalPrice}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <Check size={18} className="text-blue-600 shrink-0 stroke-[3]" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => navigate('/signup')}
                className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-blue-600 shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
                Buy Now <ArrowRight size={18} />
            </button>
        </div>
    );
};

export default TestSeriesCard;
