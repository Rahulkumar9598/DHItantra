import { useContext, useState, useEffect, createContext, type ReactNode } from 'react';
import { auth } from '../firebase';
import { type User, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    isAdmin: boolean; // Placeholder for admin role check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!auth) {
            console.warn("Auth service not available");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            // Here you would typically check user claims or a database document to determine if they are an admin
            // For now, we'll default to false
            setIsAdmin(false);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
