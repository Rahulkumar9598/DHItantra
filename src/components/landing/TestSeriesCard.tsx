import { CheckCircle, ArrowRight, Zap, Target, ScrollText, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface TestSeriesProps {
    title: string;
    description?: string;
    isNew?: boolean;
    features?: string[];
    originalPrice: string | number;
    price: string | number;
    colorTheme?: 'blue' | 'green' | 'orange';
    onExplore?: () => void;
    actions?: ReactNode; // For Admin side
    examCategory?: string;
    testCount?: number;
}

const TestSeriesCard = ({ 
    title, 
    description,
    isNew, 
    features = [], 
    originalPrice, 
    price, 
    onExplore,
    actions,
    examCategory,
    testCount
}: TestSeriesProps) => {

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.2)] transition-all duration-500 flex flex-col h-full group relative"
        >
            {/* Category Tag */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                    examCategory === 'NEET' ? 'bg-green-50 text-green-600 border-green-100' :
                    examCategory === 'JEE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                    {examCategory || 'Academic'}
                </div>
                {isNew && (
                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-slate-900/10 border border-white/10">
                        <Sparkles size={10} className="text-amber-400" />
                        New
                    </div>
                )}
            </div>

            {/* Decorative Background Icon */}
            <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-orange-50/50 transition-colors duration-500 pointer-events-none">
                <ScrollText size={160} strokeWidth={1} />
            </div>

            <div className="p-8 flex-1 flex flex-col relative z-10">
                {/* Title & Description */}
                <div className="mt-10 mb-8">
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors duration-300 min-h-[4rem] leading-[1.1] tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mt-4 line-clamp-2 leading-relaxed">
                        {description || "Master your concepts with our expert-prepared test series covering all core topics."}
                    </p>
                </div>

                {/* Educational Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 group-hover:border-orange-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm text-orange-500">
                                <ScrollText size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900">{testCount || 10}+ Tests</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Mocks</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 group-hover:border-orange-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500">
                                <Target size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900">Advanced</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Difficulty</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Feature List */}
                <div className="space-y-4 mb-8">
                    {features.slice(0, 2).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="shrink-0 w-6 h-6 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                                <CheckCircle size={14}  />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <Award size={12} className="text-amber-500" />
                                Exclusive Content
                            </span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900">
                                    {price === 'Free' || price === '0' || !price ? 'FREE' : `₹${price}`}
                                </span>
                                {price && price !== 'Free' && price !== '0' && (
                                    <span className="text-slate-300 line-through text-sm font-bold">₹{originalPrice}</span>
                                )}
                            </div>
                        </div>
                        <motion.div 
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-orange-500/10 group-hover:text-orange-500/20 transition-colors"
                        >
                            <Zap size={48} />
                        </motion.div>
                    </div>

                    {/* Action Area */}
                    {actions ? (
                        <div className="flex gap-3">
                            {actions}
                        </div>
                    ) : (
                        <button
                            onClick={onExplore}
                            className="w-full relative group/btn overflow-hidden rounded-[20px] h-14 bg-slate-900 hover:bg-orange-600 shadow-xl shadow-slate-900/10 active:scale-95 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em]">
                                Explore Now
                                <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};


export default TestSeriesCard;
