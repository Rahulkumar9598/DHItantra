import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const SocialProof = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth() || {};

  const handleProtectedNavigation = (path: string) => {
    if (currentUser) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const toppers = [
    {
      name: "Mihir S.",
      rank: "218",
      exam: "NEET",
      color: "bg-rose-500",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    },
    {
      name: "Aditi V.",
      rank: "609",
      exam: "JEE",
      color: "bg-[#0F766E]",
      image:
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6",
    },
    {
      name: "Rahul D.",
      rank: "129",
      exam: "SSC",
      color: "bg-teal-500",
      image:
        "https://images.unsplash.com/photo-1615109398623-88346a601842",
    },
  ];

  return (
    <section className="py-8 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-lg text-[10px] font-bold text-[#0D9488] uppercase tracking-widest mb-4">
                Top Performers
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-[#0F766E] leading-tight mb-4">
                Previous Year <br />
                <span className="text-[#0D9488]">Toppers</span>
              </h2>

              <p className="text-sm text-slate-500 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                Our subject experts design questions strictly aligned with real exam difficulty.
              </p>
            </div>

            {/* TOPPER CARDS */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {toppers.map((topper, i) => (
                <div key={i} className="text-center group">
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition duration-300 border border-slate-100">
                      <img
                        src={topper.image}
                        alt={topper.name}
                        className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${topper.color} text-white px-2 py-0.5 rounded text-[8px] font-black shadow-sm`}
                    >
                      {topper.exam} #{topper.rank}
                    </div>
                  </div>

                  <h4 className="mt-3 font-bold text-[#0F766E] text-xs">
                    {topper.name}
                  </h4>
                </div>
              ))}
            </div>

            {/* FEATURES */}
            <div className="flex gap-6 justify-center lg:justify-start border-t border-slate-100 pt-6">
              {[
                { label: "Syllabus-Aligned" },
                { label: "Pattern-Accurate" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[10px] font-bold text-[#0F766E] uppercase tracking-wider"
                >
                  <CheckCircle size={14} className="text-green-500" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE CTA */}
          <div className="text-center lg:text-left">
            <h3 className="text-xs font-black text-[#0D9488] uppercase tracking-widest mb-2">
              Don't Leave Your
            </h3>

            <h2 className="text-4xl md:text-5xl font-black text-[#0F766E] leading-tight mb-6">
              Rank to <br />
              <span className="text-[#0D9488]">Chance</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start mb-8">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#0D9488] border border-slate-100">
                <Clock size={20} />
              </div>

              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                Every minute matters. Start your practice with precision and engineer your success today.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto lg:mx-0">
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
              >
                Start Practice
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </button>

              <button 
                onClick={() => handleProtectedNavigation("/test-series")}
                className="w-full py-4 bg-white border border-gray-200 text-[#0F766E] rounded-xl font-bold text-lg hover:bg-teal-50 transition"
              >
                Try a Demo Test
              </button>

            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3 pt-8 text-xs text-slate-400 uppercase tracking-wider">
              <div className="w-6 h-px bg-gray-200"></div>
              Trusted by serious aspirants
              <div className="w-6 h-px bg-gray-200"></div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;