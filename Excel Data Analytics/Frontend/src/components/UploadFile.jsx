import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadFile() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError('');
        setSuccess('');

        if (selectedFile) {
            const ext = selectedFile.name.split('.').pop().toLowerCase();
            if (ext !== 'xlsx' && ext !== 'xls') {
                setError('Invalid file type. Only .xlsx and .xls files are allowed.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess(`File uploaded successfully! ${response.data.totalRows} rows parsed.`);
            setTimeout(() => {
                navigate(`/visualize/${response.data.file._id}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Upload File</h1>
                    <button onClick={() => navigate('/dashboard')} className="text-blue-500 hover:underline">
                        Back to Dashboard
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">Upload Excel File</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Select File (.xlsx or .xls)</label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={uploading || !file}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload and Parse'}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 rounded">
                        <h3 className="font-bold mb-2">Instructions:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                            <li>Only .xlsx and .xls files are supported</li>
                            <li>File size limit: 10MB</li>
                            <li>First row should contain column headers</li>
                            <li>After upload, you'll be redirected to visualize the data</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadFile;