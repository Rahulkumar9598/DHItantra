import studentBanner from '../../assets/student_banner.png';
import chartGraphic from '../../assets/chart_graphic.png';

const FeatureSliderLike = () => {
    return (
        <section className="py-20 bg-orange-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="bg-white rounded-[2rem] shadow-xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12 relative z-10 border border-orange-100">

                    {/* Image Left */}
                    <div className="w-full lg:w-1/3 relative group">
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform"></div>
                        <img
                            src={studentBanner}
                            alt="Student Learning"
                            className="relative w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
                        />
                    </div>

                    {/* Content Middle */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8">
                            Why Choose <span className="text-blue-600">Examinantt?</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: "⚙️", title: "Real-Test Experience" },
                                { icon: "⏱️", title: "Time-Scheduled Mock Tests" },
                                { icon: "📊", title: "Expert-Curated Content" },
                                { icon: "📈", title: "Smart Performance Analytics" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                                    <span className="text-2xl">{item.icon}</span>
                                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex gap-4">
                            {['#ff5e57', '#ffdd59', '#0fbcf9'].map((color, i) => (
                                <div key={i} className="w-10 h-10 rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: color }}>
                                    {['NEET', 'JEE', 'SSC'][i]}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Graphics Right (Hidden on mobile) */}
                    <div className="hidden xl:block w-1/4">
                        <img src={chartGraphic} alt="Performance Graph" className="w-full max-h-60 object-contain drop-shadow-xl" />
                    </div>
                </div>

                {/* CTA Bar */}
                <div className="mt-8 bg-blue-600 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center text-white shadow-lg lg:mx-12">
                    <span className="text-lg font-medium opacity-90">📸 @examinantt</span>
                    <span className="text-xl font-bold uppercase tracking-wider my-4 md:my-0 text-center">Start Practicing Today</span>
                    <span className="text-lg font-bold">📞 888-1188-670</span>
                </div>
            </div>
        </section>
    );
};

export default FeatureSliderLike;
