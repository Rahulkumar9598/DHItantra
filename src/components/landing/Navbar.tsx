import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
const logo = "/logo.png";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, userRole } = useAuth() || {};
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Test Series', path: '/test-series' },
        { label: 'Resources', path: '/resources' },
        { label: 'Result', path: '/results' },
        { label: 'About', path: '/about' },
    ];
    const isActive = (path: string) => location.pathname === path;
    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-slate-50/90 backdrop-blur-md shadow-sm border-b border-slate-200/60 py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center relative">
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer z-10" onClick={() => navigate('/')}>
                        <img src={logo} alt="DHItantra Logo" className="h-8 sm:h-10 w-auto rounded-full" />
                        <span className="text-xl sm:text-2xl font-bold text-[#0F766E] tracking-tight font-display">
                            DHItantra
                        </span>
                    </div>

                    {/* Desktop Links (Centered) */}
                    <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`text-[15px] font-semibold transition-all duration-200 relative py-1 ${isActive(item.path)
                                    ? 'text-[#0D9488]'
                                    : 'text-[#334155] hover:text-[#0D9488]'
                                    }`}
                            >
                                {item.label}
                                {isActive(item.path) && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0D9488] rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Auth Buttons (Right) */}
                    <div className="hidden md:flex items-center gap-4 z-10">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100">
                                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                                        <UserIcon size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 leading-none">
                                            {currentUser.displayName || currentUser.email?.split('@')[0]}
                                        </span>
                                        <span className="text-[10px] text-teal-600 font-semibold">
                                            {userRole === 'admin' ? 'Administrator' : 'Student'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(userRole === 'admin' ? '/admin-dashboard' : '/dashboard')}
                                    className="bg-[#0D9488] hover:bg-teal-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 flex items-center gap-2"
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-white text-[#0D9488] border border-[#0D9488] hover:bg-teal-50 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="bg-[#0D9488] hover:bg-teal-700 text-white border border-[#0D9488] px-6 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden z-10">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-700 hover:text-teal-600 p-2"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-slate-50 border-b border-slate-200/60 shadow-lg transition-all duration-300 ease-in-out transform origin-top ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
            >
                <div className="px-4 py-6 space-y-3">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                navigate(item.path);
                                setMobileMenuOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-3 rounded-lg text-base font-semibold transition-colors ${isActive(item.path)
                                ? 'bg-teal-100 text-[#0D9488]'
                                : 'text-slate-600 hover:text-[#0D9488] hover:bg-teal-50'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                    <div className="pt-4 mt-2 border-t border-teal-200 flex flex-col gap-3">
                        {currentUser ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-3 bg-teal-50 rounded-xl border border-teal-100">
                                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shrink-0">
                                        <UserIcon size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-700">
                                            {currentUser.displayName || currentUser.email}
                                        </span>
                                        <span className="text-xs text-teal-600 font-semibold uppercase tracking-wider">
                                            {userRole}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate(userRole === 'admin' ? '/admin-dashboard' : '/dashboard');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-[#0D9488] text-white font-semibold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2"
                                >
                                    <LayoutDashboard size={18} />
                                    Go to Dashboard
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-white text-[#0D9488] border border-[#0D9488] font-semibold py-2.5 rounded-full transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="w-full bg-[#0D9488] text-white font-semibold py-2.5 rounded-full shadow-sm hover:bg-teal-700 transition-all"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
