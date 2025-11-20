import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard({ user, onLogout }) {
    const [stats, setStats] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, filesRes] = await Promise.all([
                axios.get('/user/stats'),
                axios.get('/user/files')
            ]);
            setStats(statsRes.data);
            setFiles(filesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await axios.delete(`/upload/file/${fileId}`);
                fetchData();
            } catch (error) {
                alert('Error deleting file');
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
                    <h1 className="text-2xl font-bold text-blue-600">User Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user.username}</span>
                        <Link to="/change-password" className="text-blue-500 hover:underline">Change Password</Link>
                        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Files Uploaded</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats?.filesUploaded || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Visualizations Accessed</h3>
                        <p className="text-3xl font-bold text-green-600">{stats?.visualizationsAccessed || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Charts Downloaded</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats?.chartsDownloaded || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Files</h3>
                        <p className="text-3xl font-bold text-orange-600">{stats?.totalFiles || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <Link to="/upload" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block">
                        Upload New File
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Your Files</h2>
                    </div>
                    <div className="p-6">
                        {files.length === 0 ? (
                            <p className="text-gray-500">No files uploaded yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Filename</th>
                                            <th className="text-left p-3">Uploaded At</th>
                                            <th className="text-left p-3">Rows</th>
                                            <th className="text-left p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files.map((file) => (
                                            <tr key={file._id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{file.originalName}</td>
                                                <td className="p-3">{new Date(file.uploadedAt).toLocaleString()}</td>
                                                <td className="p-3">{file.parsedData?.length || 0}</td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => navigate(`/visualize/${file._id}`)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                                                    >
                                                        Visualize
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(file._id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
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

export default UserDashboard;