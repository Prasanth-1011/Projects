import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard({ user, onLogout }) {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const [files, setFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, adminsRes, filesRes] = await Promise.all([
                axios.get('/admin/stats'),
                axios.get('/admin/users'),
                axios.get('/admin/admins'),
                axios.get('/admin/files')
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setAdmins(adminsRes.data);
            setFiles(filesRes.data);

            if (user.root) {
                const pendingRes = await axios.get('/admin/pending-admins');
                setPendingAdmins(pendingRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActivateAdmin = async (adminId) => {
        try {
            await axios.put(`/admin/activate-admin/${adminId}`);
            fetchData();
        } catch (error) {
            alert('Error activating admin');
        }
    };

    const handlePromoteToRoot = async (adminId) => {
        if (window.confirm('Are you sure you want to promote this admin to root?')) {
            try {
                await axios.put(`/admin/promote-root/${adminId}`);
                fetchData();
            } catch (error) {
                alert('Error promoting admin');
            }
        }
    };

    const handleRevokeRoot = async (adminId) => {
        if (window.confirm('Are you sure you want to revoke root privileges?')) {
            try {
                await axios.put(`/admin/revoke-root/${adminId}`);
                fetchData();
            } catch (error) {
                alert('Error revoking root');
            }
        }
    };

    const handleDeactivateUser = async (userId) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await axios.delete(`/admin/deactivate-user/${userId}`);
                fetchData();
            } catch (error) {
                alert('Error deactivating user');
            }
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-purple-600">
                        Admin Dashboard {user.root && <span className="text-sm text-orange-500">(Root)</span>}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user.username}</span>
                        <Link to="/change-password" className="text-purple-500 hover:underline">Change Password</Link>
                        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Users</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Admins</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats?.totalAdmins || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Files</h3>
                        <p className="text-3xl font-bold text-green-600">{stats?.totalFiles || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Pending Admins</h3>
                        <p className="text-3xl font-bold text-orange-600">{stats?.pendingAdmins || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 ${activeTab === 'overview' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 ${activeTab === 'users' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('admins')}
                            className={`px-6 py-3 ${activeTab === 'admins' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
                        >
                            Admins
                        </button>
                        {user.root && (
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-3 ${activeTab === 'pending' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
                            >
                                Pending Admins
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`px-6 py-3 ${activeTab === 'files' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
                        >
                            Files
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">System Overview</h2>
                                <p className="text-gray-600">Welcome to the admin dashboard. Use the tabs above to manage users, admins, and files.</p>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="overflow-x-auto">
                                <h2 className="text-xl font-bold mb-4">All Users</h2>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Username</th>
                                            <th className="text-left p-3">Email</th>
                                            <th className="text-left p-3">Files</th>
                                            <th className="text-left p-3">Visualizations</th>
                                            <th className="text-left p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{u.username}</td>
                                                <td className="p-3">{u.email}</td>
                                                <td className="p-3">{u.filesUploaded}</td>
                                                <td className="p-3">{u.visualizationsAccessed}</td>
                                                <td className="p-3">
                                                    {user.root && (
                                                        <button
                                                            onClick={() => handleDeactivateUser(u._id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'admins' && (
                            <div className="overflow-x-auto">
                                <h2 className="text-xl font-bold mb-4">All Admins</h2>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Username</th>
                                            <th className="text-left p-3">Email</th>
                                            <th className="text-left p-3">Status</th>
                                            <th className="text-left p-3">Root</th>
                                            <th className="text-left p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.map((a) => (
                                            <tr key={a._id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{a.username}</td>
                                                <td className="p-3">{a.email}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs ${a.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">{a.root ? '✓' : '✗'}</td>
                                                <td className="p-3">
                                                    {user.root && a._id !== user.id && (
                                                        <>
                                                            {!a.root && (
                                                                <button
                                                                    onClick={() => handlePromoteToRoot(a._id)}
                                                                    className="bg-orange-500 text-white px-3 py-1 rounded mr-2 hover:bg-orange-600 text-xs"
                                                                >
                                                                    Promote to Root
                                                                </button>
                                                            )}
                                                            {a.root && (
                                                                <button
                                                                    onClick={() => handleRevokeRoot(a._id)}
                                                                    className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                                                                >
                                                                    Revoke Root
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'pending' && user.root && (
                            <div className="overflow-x-auto">
                                <h2 className="text-xl font-bold mb-4">Pending Admin Approvals</h2>
                                {pendingAdmins.length === 0 ? (
                                    <p className="text-gray-500">No pending admins</p>
                                ) : (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-3">Username</th>
                                                <th className="text-left p-3">Email</th>
                                                <th className="text-left p-3">Registered</th>
                                                <th className="text-left p-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingAdmins.map((a) => (
                                                <tr key={a._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-3">{a.username}</td>
                                                    <td className="p-3">{a.email}</td>
                                                    <td className="p-3">{new Date(a.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => handleActivateAdmin(a._id)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        >
                                                            Activate
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                        {activeTab === 'files' && (
                            <div className="overflow-x-auto">
                                <h2 className="text-xl font-bold mb-4">All Files</h2>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Filename</th>
                                            <th className="text-left p-3">Uploaded By</th>
                                            <th className="text-left p-3">Date</th>
                                            <th className="text-left p-3">Rows</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files.map((f) => (
                                            <tr key={f._id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{f.originalName}</td>
                                                <td className="p-3">{f.userId?.username || 'Unknown'}</td>
                                                <td className="p-3">{new Date(f.uploadedAt).toLocaleString()}</td>
                                                <td className="p-3">{f.parsedData?.length || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;