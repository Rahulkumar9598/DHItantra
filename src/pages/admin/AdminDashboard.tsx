import { motion } from 'framer-motion';
import { Upload, Users, FileText, CheckCircle, Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
    return (
        <DashboardLayout role="admin">
            <div className="dashboard-content">
                {/* Quick Actions */}
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary">
                            <Plus size={18} style={{ marginRight: '8px' }} /> New Test Series
                        </button>
                        <button className="btn-outline">
                            <Upload size={18} style={{ marginRight: '8px' }} /> Bulk Upload Questions
                        </button>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="stats-grid">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="stat-card"
                    >
                        <div className="stat-header">
                            <span className="stat-label">Total Students</span>
                            <div className="stat-icon"><Users size={20} /></div>
                        </div>
                        <div className="stat-value">1,248</div>
                        <div className="stat-trend up"><span>+12% this month</span></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="stat-card"
                    >
                        <div className="stat-header">
                            <span className="stat-label">Active Test Series</span>
                            <div className="stat-icon"><FileText size={20} /></div>
                        </div>
                        <div className="stat-value">45</div>
                        <div className="stat-trend"><span>Objective & Subjective</span></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="stat-card"
                    >
                        <div className="stat-header">
                            <span className="stat-label">Pending Evaluations</span>
                            <div className="stat-icon"><CheckCircle size={20} /></div>
                        </div>
                        <div className="stat-value">18</div>
                        <div className="stat-trend down"><span>Needs attention</span></div>
                    </motion.div>
                </section>

                {/* Recent Uploads / Management Section */}
                <section className="dashboard-section">
                    <div className="section-title">
                        <h2>Recent Test Series</h2>
                        <button className="btn-outline" style={{ padding: '0.4rem 1rem' }}>View All</button>
                    </div>

                    <div className="glass-card" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Title</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Type</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Price</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { title: 'Advanced Physics 2024', type: 'Objective', price: '₹999', status: 'Active' },
                                    { title: 'English Literature Final', type: 'Subjective', price: '₹499', status: 'Draft' },
                                    { title: 'Maths Olympiad Prep', type: 'Objective', price: '₹1499', status: 'Active' },
                                ].map((test, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{test.title}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                background: test.type === 'Objective' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                                                color: test.type === 'Objective' ? '#818cf8' : '#f472b6',
                                                fontSize: '0.8rem'
                                            }}>
                                                {test.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{test.price}</td>
                                        <td style={{ padding: '1rem' }}>{test.status}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button style={{ color: 'var(--primary)', marginRight: '1rem' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
