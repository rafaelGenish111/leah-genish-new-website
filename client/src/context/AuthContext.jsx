import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await authService.login(email, password);

            setToken(response.token);
            setUser(response.user);
            setIsAuthenticated(true);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Login failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Call logout API (optional)
        authService.logout().catch(console.error);
    };

    const loadUser = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
            return { success: false, error: error.message };
        }
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            await authService.updatePassword({ currentPassword, newPassword });
            return { success: true };
        } catch (error) {
            console.error('Password update error:', error);
            return {
                success: false,
                error: error.message || 'Password update failed'
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        loadUser,
        updatePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
