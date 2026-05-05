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
    <section className="bg-transparent py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">



        {/* SECTION 1 */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-full text-xs font-semibold text-teal-600">
              <BarChart3 size={14} /> Precision Analytics
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
              Analytics That Doesn't Just Check Answers —{" "}
              <span className="text-teal-600">It Improves Scores.</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base">
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
                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => handleProtectedNavigation('/dashboard/analytics')}
                className="px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                Explore Analytics
              </button>
              <button 
                onClick={() => handleProtectedNavigation('/dashboard/results')}
                className="px-5 py-2.5 text-teal-600 rounded-lg text-sm font-semibold hover:bg-teal-50 transition-colors"
              >
                View Sample Report
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">

            <h3 className="font-semibold text-gray-800 text-sm">
              Performance Audit
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Composite Score</span>
                <span className="font-semibold text-gray-800">482 / 720</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Accuracy", val: "68%" },
                { label: "Time Eff.", val: "91%" }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[11px] text-gray-500">{item.label}</p>
                  <p className="font-semibold text-sm">{item.val}</p>
                  <div className="h-1 bg-gray-100 rounded-full mt-1">
                    <div className="h-full bg-teal-500" style={{ width: item.val }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 p-3 rounded-lg flex items-center gap-2">
              <PieChartIcon size={16} className="text-teal-600" />
              <div>
                <p className="text-[10px] text-gray-500">Error Breakdown</p>
                <p className="font-semibold text-sm text-gray-800">
                  74% Avoidable Mistakes
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2 */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">
              The Workflow
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Simulation That <span className="text-teal-600">Wins Exams.</span>
            </h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              We don't just give you questions. We give you the exact environment of JEE and NEET.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Official Interface", desc: "Same pixels, same rules as the real day.", icon: <MousePointer2 size={18} /> },
              { title: "Live Windows", desc: "Strict schedules. No pause. Full focus.", icon: <Clock size={18} /> },
              { title: "Physical OMR", desc: "Practice bubbling under pressure.", icon: <FileText size={18} /> },
              { title: "Smart Sync", desc: "Upload. Scan. Analyze instantly.", icon: <AlertCircle size={18} /> }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-lg p-4 text-center hover:shadow-sm transition">
                <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-teal-50 rounded-md text-teal-600 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
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