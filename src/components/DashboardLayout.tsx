import { type ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    TrendingUp,
    Settings,
    LogOut,
    FileText,
    Users,
    Menu,
    X,
    Bell,
    BookMarked,
    FolderTree,
    Award,
    ListChecks
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
const logo = "/logo.png";

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'student' | 'admin';
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
        { icon: <BookOpen size={20} />, label: 'My Tests', path: '/dashboard/tests' },
        { icon: <Award size={20} />, label: 'Test Results', path: '/dashboard/results' },
        { icon: <FileText size={20} />, label: 'Buy Series', path: '/dashboard/market' },
        // { icon: <BookOpen size={20} />, label: 'Resources', path: '/dashboard/resources' },
        { icon: <TrendingUp size={20} />, label: 'Analytics', path: '/dashboard/analytics' },
    ];

    const adminLinks = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin-dashboard' },
        { icon: <ListChecks size={20} />, label: 'Test Series', path: '/admin-dashboard/test-series' },
        { icon: <BookMarked size={20} />, label: 'Question Bank', path: '/admin-dashboard/question-bank' },
        { icon: <FolderTree size={20} />, label: 'Chapters', path: '/admin-dashboard/chapters' },
        { icon: <BookOpen size={20} />, label: 'Manage Tests', path: '/admin-dashboard/tests' },
        { icon: <Award size={20} />, label: 'Subjects', path: '/admin-dashboard/subjects' },
        { icon: <FolderTree size={20} />, label: 'Classes', path: '/admin-dashboard/classes' },
        { icon: <BookOpen size={20} />, label: 'Resources', path: '/admin-dashboard/resources' },
        { icon: <Users size={20} />, label: 'Students', path: '/admin-dashboard/students' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin-dashboard/settings' },
    ];

    const links = role === 'admin' ? adminLinks : studentLinks;

    // Determine theme based on role or globally (For now enforcing Dark for Admin as requested, but Layout wraps both. 
    // We'll apply Dark Theme generally as the user implies a system-wide design change or at least for the Admin view).
    // The screenshot implies a global dark theme app.
    const isDarkTheme = false; // Could be a prop or context later.

    return (
        <div className={`min-h-screen flex ${isDarkTheme ? 'bg-[#0B0F19] text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 h-screen w-64 
                    bg-slate-50 border-slate-200
                    border-r z-50 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col print:hidden
                `}
            >
                {/* Logo Area */}
                <div className="px-5 py-6 flex items-center gap-3">
                    <img src={logo} alt="Logo" className={`w-8 h-8 rounded-md p-0.5 bg-white border border-slate-200`} />
                    <div>
                        <h2 className={`text-base font-bold text-slate-800 tracking-tight leading-tight`}>
                            DHItantra
                        </h2>
                        <p className={`text-[10px] text-slate-500`}>
                            {role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className={`ml-auto lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200`}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Separator */}
                <div className={`h-px bg-slate-200 mx-5 mb-4`}></div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide py-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium
                                ${isActive
                                    ? 'bg-slate-200/50 text-teal-600'
                                    : `text-slate-600 hover:bg-slate-100 hover:text-slate-900`
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`transition-transform duration-200`}>
                                        {link.icon}
                                    </span>
                                    <span>{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 mt-auto">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50`}
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className={`sticky top-0 z-30 px-6 py-3 flex items-center justify-between border-b bg-white border-slate-200 print:hidden`}>
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100`}
                        >
                            <Menu size={18} />
                        </button>
                        <div className="min-w-0">
                            <h1 className={`text-base md:text-lg font-semibold truncate text-slate-800`}>
                                {role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className={`relative p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100`}>
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full border border-white"></span>
                        </button>
                        <div className={`flex items-center gap-3 pl-3 border-l border-slate-200`}>
                            <div className="text-right hidden lg:block">
                                <p className={`text-sm font-medium text-slate-700`}>{currentUser?.displayName }</p>
                                <p className={`text-[11px] text-slate-500`}>
                                    {currentUser?.email}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden pt-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
