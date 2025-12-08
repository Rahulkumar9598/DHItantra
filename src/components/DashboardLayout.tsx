import { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    TrendingUp,
    Settings,
    LogOut,
    FileText,
    Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import '../styles/Dashboard.css';   

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'student' | 'admin';
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
    const authContext = useAuth();
    const currentUser = authContext?.currentUser;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const studentLinks = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/student/dashboard' },
        { icon: <BookOpen size={20} />, label: 'My Tests', path: '/student/tests' },
        { icon: <FileText size={20} />, label: 'Buy Series', path: '/student/market' }, // "Buy test series"
        { icon: <TrendingUp size={20} />, label: 'Analytics', path: '/student/analytics' },
    ];

    const adminLinks = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <BookOpen size={20} />, label: 'Manage Tests', path: '/admin/tests' }, // "Upload test series"
        { icon: <Users size={20} />, label: 'Students', path: '/admin/students' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    ];

    const links = role === 'admin' ? adminLinks : studentLinks;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>Examinantt</h2>
                </div>

                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="nav-item" style={{ width: '100%', color: '#ef4444' }}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="dashboard-header">
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>
                            {role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}
                        </h1>
                        <p className="text-muted">Welcome back, {currentUser?.email}</p>
                    </div>

                    <div className="user-profile">
                        <div className="avatar">
                            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span>{role === 'admin' ? 'Administrator' : 'Student'}</span>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
