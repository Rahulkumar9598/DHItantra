import { motion } from 'framer-motion';
import { PlayCircle, Clock, Award, BarChart2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const navigate = useNavigate();

    return (
        <DashboardLayout role="student">
            <div className="dashboard-content">
                {/* Stats Grid */}
                <section className="stats-grid">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="stat-card"
                    >
                        <div className="stat-header">
                            <span className="stat-label">Tests Completed</span>
                            <div className="stat-icon"><Award size={20} /></div>
                        </div>
                        <div className="stat-value">12</div>
                        <div className="stat-trend up"><span>+2 this week</span></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="stat-card"
                    >
                        <div className="stat-header">
                            <span className="stat-label">Average Score</span>
                            <div className="stat-icon"><BarChart2 size={20} /></div>
                        </div>
                        <div className="stat-value">78%</div>
                        <div className="stat-trend up"><span>+5% improvement</span></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="stat-card"
                    >
                        <div className="stat-header">
                            <span className="stat-label">Hours Spent</span>
                            <div className="stat-icon"><Clock size={20} /></div>
                        </div>
                        <div className="stat-value">24h</div>
                        <div className="stat-trend"><span>Last 30 days</span></div>
                    </motion.div>
                </section>

                {/* Recent Tests Section */}
                <section className="dashboard-section">
                    <div className="section-title">
                        <h2>Recommended Test Series</h2>
                        <button className="btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => navigate('/student/market')}>
                            View Market
                        </button>
                    </div>

                    <div className="card-grid">
                        {/* Mock Data */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="content-card"
                            >
                                <div className="card-image">
                                    <div className="card-badge">JEE Mains</div>
                                </div>
                                <div className="card-body">
                                    <h3 className="card-title">Full Mock Test Series {i}</h3>
                                    <div className="card-meta">
                                        <span><Clock size={14} style={{ verticalAlign: 'middle' }} /> 3 Hours</span>
                                        <span><PlayCircle size={14} style={{ verticalAlign: 'middle' }} /> 15 Tests</span>
                                    </div>
                                    <div className="card-footer">
                                        <span className="price-tag">₹499</span>
                                        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-title">
                        <h2>Your Active Tests</h2>
                    </div>
                    {/* Placeholder for empty state */}
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <PlayCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>You haven't started any tests yet.</p>
                        <button className="btn-primary" style={{ marginTop: '1rem' }}>Browse Tests</button>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
