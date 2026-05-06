import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  MousePointer2,
  Clock,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';


const AISimulationSection = () => {
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
    <section className="bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* SECTION 1 */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">

          {/* LEFT */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-teal-50 rounded-lg text-[10px] font-bold text-teal-600 uppercase tracking-wider">
              <BarChart3 size={12} /> Precision Analytics
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
              Analytics That Doesn't Just Check Answers —{" "}
              <span className="text-teal-600">It Improves Scores.</span>
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed">
              Our proprietary analytics engine deep-dives into your performance metrics to isolate concept gaps, time pressure bottlenecks, and OMR risks.
            </p>

            {/* Feature Points */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: "Mistake Audit", desc: "Identify repeated patterns automatically" },
                { title: "Speed Balance", desc: "Track accuracy vs velocity ratio" },
                { title: "OMR Risk Detection", desc: "Avoid bubbles errors early" },
                { title: "Revision Path", desc: "Clear direction on what's next" }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="font-bold text-gray-800 text-xs">{item.title}</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => handleProtectedNavigation('/dashboard/analytics')}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
              >
                Explore Analytics
              </button>
              <button 
                onClick={() => handleProtectedNavigation('/dashboard/results')}
                className="px-4 py-2 text-teal-600 border border-teal-100 rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors"
              >
                View Sample Report
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
              Performance Audit
            </h3>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-500 font-bold uppercase">Composite Score</span>
                <span className="font-black text-gray-800">482 / 720</span>
              </div>
              <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Accuracy", val: "68%" },
                { label: "Time Eff.", val: "91%" }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{item.label}</p>
                  <p className="font-black text-xs">{item.val}</p>
                  <div className="h-1 bg-slate-50 rounded-full mt-1">
                    <div className="h-full bg-teal-500" style={{ width: item.val }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-teal-50/50 p-3 rounded-lg flex items-center gap-2 border border-teal-50">
              <PieChartIcon size={14} className="text-teal-600" />
              <div>
                <p className="text-[9px] text-teal-600/70 font-bold uppercase">Error Breakdown</p>
                <p className="font-bold text-xs text-teal-800">
                  74% Avoidable Mistakes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <p className="text-[10px] text-teal-600/60 font-black uppercase tracking-widest">
              The Workflow
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Simulation That <span className="text-teal-600">Wins Exams.</span>
            </h2>
            <p className="text-gray-500 text-xs max-w-lg mx-auto leading-relaxed">
              We don't just give you questions. We give you the exact environment of JEE and NEET.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Official Interface", desc: "Same pixels, same rules as the real day.", icon: <MousePointer2 size={16} /> },
              { title: "Live Windows", desc: "Strict schedules. No pause. Full focus.", icon: <Clock size={16} /> },
              { title: "Physical OMR", desc: "Practice bubbling under pressure.", icon: <FileText size={16} /> },
              { title: "Smart Sync", desc: "Upload. Scan. Analyze instantly.", icon: <AlertCircle size={16} /> }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 text-center hover:border-teal-100 transition shadow-sm">
                <div className="w-9 h-9 mx-auto mb-3 flex items-center justify-center bg-slate-50 rounded text-teal-600 border border-slate-100">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-xs mb-1">
                  {item.title}
                </h3>
                <p className="text-[10px] text-gray-400 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="bg-teal-600 rounded-xl p-6 text-white grid md:grid-cols-2 gap-6 items-center">

          <div className="space-y-3">
            <h3 className="text-lg font-bold">Why This Matters</h3>
            <p className="text-teal-100 text-sm">
              Many students lose 30-60 marks not due to lack of knowledge, but due to exam pressure and OMR mistakes. We fix that before D-day.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => handleProtectedNavigation('/test-series')}
                className="px-4 py-2 bg-white text-teal-600 rounded-md text-sm font-semibold hover:bg-teal-50 transition-colors"
              >
                Try Demo Test (Free)
              </button>
              <button 
                onClick={() => handleProtectedNavigation('/dashboard/analytics')}
                className="px-4 py-2 text-white text-sm hover:text-teal-100 transition-colors"
              >
                View Sample Analysis
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end gap-5">
            {[
              "Exam-Pattern Accurate",
              "Pressure Oriented Practice",
              "No Guesswork Analysis"
            ].map((text, i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={14} />
                </div>
                <p className="text-[10px]">{text}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AISimulationSection;