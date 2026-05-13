import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    FileText,
    Plus,
    BookOpen,
    HelpCircle,
    Copy,
    TrendingUp,
    Loader2,
    Award,
    ListChecks
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth() || {};
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [stats, analytics] = await Promise.all([
                    dashboardService.getDashboardStats(),
                    dashboardService.getAnalyticsData()
                ]);
                setDashboardStats(stats);
                setChartData(analytics);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);



    const stats = [
        {
            label: 'Total Students',
            value: dashboardStats?.totalStudents.toLocaleString() || '0',
            trend: 'Registered',
            trendUp: true,
            icon: Users,
            color: 'bg-slate-50',
            glow: ''
        },
        {
            label: 'Active Test Series',
            value: dashboardStats?.activeTestSeries.toLocaleString() || '0',
            trend: 'Live & Published',
            trendUp: true,
            icon: Copy,
            color: 'bg-slate-50',
            glow: ''
        },
        {
            label: 'Question Bank',
            value: dashboardStats?.totalQuestions.toLocaleString() || '0',
            trend: 'Total Questions',
            trendUp: true,
            icon: HelpCircle,
            color: 'bg-slate-50',
            glow: ''
        },
        {
            label: 'Total Chapters',
            value: dashboardStats?.totalChapters.toLocaleString() || '0',
            trend: 'Across all subjects',
            trendUp: true,
            icon: BookOpen,
            color: 'bg-slate-50',
            glow: ''
        }
    ];

    const quickActions = [
        { label: 'Create Test Series', icon: Plus, path: '/admin-dashboard/test-series', color: 'bg-slate-800 text-white hover:bg-slate-700' },
        { label: 'Create New Test', icon: FileText, path: '/admin-dashboard/create-test', color: 'bg-slate-800 text-white hover:bg-slate-700' },
        { label: 'Add Question', icon: HelpCircle, path: '/admin-dashboard/question-bank', color: 'bg-slate-800 text-white hover:bg-slate-700' },
        { label: 'Manage Individual Tests', icon: ListChecks, path: '/admin-dashboard/tests', color: 'bg-slate-800 text-white hover:bg-slate-700' },
        { label: 'Manage Subjects', icon: Award, path: '/admin-dashboard/subjects', color: 'bg-slate-800 text-white hover:bg-slate-700' },
        { label: 'Manage Classes', icon: Copy, path: '/admin-dashboard/classes', color: 'bg-slate-800 text-white hover:bg-slate-700' },
        { label: 'Create Chapter', icon: BookOpen, path: '/admin-dashboard/chapters', color: 'bg-slate-800 text-white hover:bg-slate-700' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex justify-center items-center">
                <Loader2 className="animate-spin text-teal-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-500 mt-1">Manage and monitor platform performance</p>
                    </div>
                    <div className="px-3 py-1.5 bg-white rounded-md border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-md p-6 border border-slate-200 relative overflow-hidden group transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-md ${stat.color} text-slate-600`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                                <p className="text-slate-500 text-xs mb-3 font-medium uppercase tracking-wider">{stat.label}</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-tight">
                                    <TrendingUp size={12} />
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Analytics Chart */}
                    <div className="lg:col-span-2 bg-white rounded-md p-6 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-md font-bold text-slate-900">Platform Analytics</h2>
                            <select className="bg-white border border-slate-200 rounded-md text-xs font-bold uppercase text-slate-500 px-2 py-1 focus:ring-0 cursor-pointer hover:border-slate-300 transition-colors">
                                <option>This Week</option>
                                <option>Last Week</option>
                                <option>This Month</option>
                            </select>
                        </div>

                        <div className="h-48 w-full flex items-end justify-between px-2 gap-3">
                            {chartData.map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end group h-full">
                                    <div
                                        className="w-full bg-slate-100 rounded-sm relative overflow-hidden transition-all h-full"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute inset-0 bg-teal-600/10 opacity-50"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-slate-400 px-1 uppercase font-bold tracking-widest">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-md p-6 border border-slate-200 h-full shadow-sm">
                            <h2 className="text-md font-bold text-slate-900 mb-6">Quick Actions</h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate(action.path)}
                                        className="w-full flex items-center justify-between gap-3 p-3 bg-white border border-slate-100 rounded-md text-left group hover:bg-slate-50 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-slate-50 text-slate-600 group-hover:text-teal-600 transition-colors">
                                                <action.icon size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{action.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;
