import { useContext, useState, useEffect, createContext, type ReactNode } from 'react';
import { auth, db } from '../firebase';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    userRole: 'student' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !db) return;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            
            if (user) {
                // If we have a user, fetch their role before finishing loading
                const unsubRole = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role as 'student' | 'admin' || 'student');
                    } else {
                        setUserRole('student');
                    }
                    setLoading(false);
                }, (error) => {
                    console.warn("Role listener error:", error);
                    setUserRole('student');
                    setLoading(false);
                });
                
                return () => unsubRole();
            } else {
                setUserRole(null);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        userRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
