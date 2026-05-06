import { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

type LeaderboardEntry = {
  id: string;
  name: string;
  classLevel: '10' | '11' | '12';
  score: number; // out of 100
  exam: string;
};

// Dummy pool for now, but UI is clean and matches theme
const STUDENTS_POOL: LeaderboardEntry[] = [
  { id: 's1', name: 'Aarav Sharma', classLevel: '10', score: 96, exam: 'School' },
  { id: 's2', name: 'Isha Patel', classLevel: '10', score: 92, exam: 'School' },
  { id: 's3', name: 'Rohit Gupta', classLevel: '11', score: 94, exam: 'JEE/NEET' },
  { id: 's4', name: 'Ananya Verma', classLevel: '11', score: 91, exam: 'JEE/NEET' },
  { id: 's5', name: 'Kabir Singh', classLevel: '12', score: 97, exam: 'JEE' },
  { id: 's6', name: 'Meera Reddy', classLevel: '12', score: 93, exam: 'NEET' },
  { id: 's7', name: 'Riya Das', classLevel: '11', score: 89, exam: 'JEE' },
  { id: 's8', name: 'Arjun Mehra', classLevel: '12', score: 90, exam: 'Commerce' },
];


export default function LeaderboardSection() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

  useEffect(() => {
    // Simulate fetching different data for different tabs
    const getScrambledData = () => {
      const basePool = [...STUDENTS_POOL];
      // Slightly modify scores based on tab to show change
      const modified = basePool.map(s => ({
        ...s,
        score: Math.min(100, s.score + (activeTab === 'monthly' ? -2 : activeTab === 'all-time' ? 1 : 0))
      }));
      return modified.sort((a, b) => b.score - a.score).slice(0, 5);
    };

    setEntries(getScrambledData());
  }, [activeTab]);


  return (
    <section className="py-8 bg-transparent relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F766E] tracking-tight mb-2">
              Leader<span className="text-[#0D9488]">board</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Top performers across all categories this week.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['weekly', 'monthly', 'all-time'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab
                    ? 'bg-white text-[#0D9488] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Top 5 - Compact & Professional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {entries.map((student, index) => {
            const isRank1 = index === 0;
            return (
              <motion.div
                key={student.id + activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative bg-white border border-slate-100 rounded-xl p-5 hover:border-teal-200 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                {/* Rank Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black w-6 h-6 rounded flex items-center justify-center ${
                    index === 0 ? 'bg-amber-400 text-white' : 
                    index === 1 ? 'bg-slate-300 text-white' : 
                    index === 2 ? 'bg-orange-300 text-white' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    #{index + 1}
                  </span>
                  {isRank1 && <Trophy size={14} className="text-amber-500" />}
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center mb-5">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black mb-3 border-2 ${
                    isRank1 ? 'border-amber-100 bg-amber-50 text-amber-600' : 'border-slate-50 bg-slate-50 text-slate-600'
                  }`}>
                    {student.name.charAt(0)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 truncate w-full text-center">{student.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Class {student.classLevel}</p>
                </div>

                {/* Stats */}
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Accuracy</span>
                    <span className="text-sm font-black text-slate-900">{student.score}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${student.score}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${isRank1 ? 'bg-amber-400' : 'bg-teal-500'}`}
                    />
                  </div>
                </div>

                {/* Tag */}
                <div className="mt-3 text-center">
                  <span className="inline-block px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-bold text-slate-500 uppercase">
                    {student.exam}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Footer - Tighter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto py-8 border-y border-slate-100 mb-8">
          {[
            { label: 'Total Aspirants', value: '12,500+', color: 'text-slate-900' },
            { label: 'Avg. Accuracy', value: '74.2%', color: 'text-slate-900' },
            { label: 'Tests Conducted', value: '85K+', color: 'text-slate-900' },
            { label: 'Active Today', value: '1,200+', color: 'text-[#0D9488]' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Live Standings - Compact */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next in Line</span>
              <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-500">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                Live Standings
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {STUDENTS_POOL.slice(5, 8).map((student, idx) => (
                <div key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all cursor-default group">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-slate-300 w-5 group-hover:text-teal-500 transition-colors">#{idx + 6}</span>
                    <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center font-bold text-slate-600 text-xs group-hover:bg-teal-500 group-hover:text-white transition-all">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors text-xs">{student.name}</div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase">Class {student.classLevel} • {student.exam}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">{student.score}%</div>
                    </div>
                    <Medal size={14} className="text-slate-200 group-hover:text-teal-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
