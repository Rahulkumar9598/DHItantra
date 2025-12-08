import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/Auth.css';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'student' | 'admin'>('student'); // Basic role selection for MVP
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (!auth || !db) {
            setError('Firebase is not configured. Please check your .env file for valid keys.');
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Create user document in Firestore with role
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                role: role,
                createdAt: new Date()
            });

            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Failed to create an account. ' + err.message);
        }

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
                    <h2>Create Account</h2>
                    <p className="text-muted">Join Examinantt and start excelling</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>I am a</label>
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${role === 'student' ? 'active' : ''}`}
                                onClick={() => setRole('student')}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                                onClick={() => setRole('admin')}
                            >
                                Admin (Demo)
                            </button>
                        </div>
                    </div>

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
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button disabled={loading} type="submit" className="btn-primary full-width">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'} <ChevronRight size={20} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="text-muted">
                        Already have an account? <Link to="/login" className="text-gradient">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
