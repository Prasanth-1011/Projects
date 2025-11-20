import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChangePassword from './components/Auth/ChangePassword';
import ForgotPassword from './components/Auth/ForgotPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import IntermediateAdminPage from './components/Dashboard/IntermediateAdminPage';
import UploadFile from './components/UploadFile';
import DataVisualization from './components/DataVisualization';

axios.defaults.baseURL = 'https://excel-data-analytics-cxdv.onrender.com/api';
axios.defaults.withCredentials = true;

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/auth/me');
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (userData, token) => {
        setUser(userData);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        axios.post('/auth/logout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login onLogin={handleLogin} />} />
                <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Register onRegister={handleLogin} />} />
                <Route path="/forgot-password" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <ForgotPassword />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute user={user} requiredRole="user">
                        <UserDashboard user={user} onLogout={handleLogout} />
                    </ProtectedRoute>
                } />

                <Route path="/upload" element={
                    <ProtectedRoute user={user} requiredRole="user">
                        <UploadFile user={user} />
                    </ProtectedRoute>
                } />

                <Route path="/visualize/:fileId" element={
                    <ProtectedRoute user={user} requiredRole="user">
                        <DataVisualization user={user} />
                    </ProtectedRoute>
                } />

                <Route path="/change-password" element={
                    <ProtectedRoute user={user}>
                        <ChangePassword />
                    </ProtectedRoute>
                } />

                <Route path="/admin" element={
                    <ProtectedRoute user={user} requiredRole="admin">
                        {user && user.status === 'pending' ? (
                            <IntermediateAdminPage onLogout={handleLogout} />
                        ) : (
                            <AdminDashboard user={user} onLogout={handleLogout} />
                        )}
                    </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
            </Routes>
        </Router>
    );
}

export default App;
