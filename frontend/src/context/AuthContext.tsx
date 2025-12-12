import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getProfile } from '../services/auth';

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await getProfile(token);
                    if (response.success) {
                        setUser(response.data.user);
                    } else {
                        logout();
                    }
                } catch {
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (credentials: any) => {
        const response = await loginUser(credentials);
        if (response.success) {
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
        }
    };

    const register = async (data: any) => {
        const response = await registerUser(data);
        if (response.success) {
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
