import React from 'react';

function IntermediateAdminPage({ onLogout }) {
    const handleLogout = () => {
        onLogout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-yellow-600">Admin Verification Required</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="flex items-center justify-center p-4 mt-20">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                    <div className="mb-6">
                        <svg className="w-24 h-24 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Pending Approval</h2>

                    <p className="text-gray-600 mb-6">
                        Your admin account is currently pending approval. A root administrator needs to activate your account before you can access the admin dashboard.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-left mb-6">
                        <h3 className="font-bold text-yellow-800 mb-2">What happens next?</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• A root admin will review your request</li>
                            <li>• You'll receive access once approved</li>
                            <li>• Please check back later or contact support</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition font-semibold"
                    >
                        Refresh Status
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IntermediateAdminPage;