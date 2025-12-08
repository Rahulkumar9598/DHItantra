import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!auth) {
            setError('Firebase is not configured. Please check your .env file for valid keys.');
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard'); // Use a generic dashboard route for now, we'll redirect based on role later
        } catch (err: any) {
            console.error(err);
            setError('Failed to log in. Please check your credentials.');
        } // finally is not supported in older targets, but standard now. safe to use or just set loading false after await.

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card glass-card"
            >
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p className="text-muted">Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button disabled={loading} type="submit" className="btn-primary full-width">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'} <ChevronRight size={20} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="text-muted">
                        Don't have an account? <Link to="/signup" className="text-gradient">Sign Up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
