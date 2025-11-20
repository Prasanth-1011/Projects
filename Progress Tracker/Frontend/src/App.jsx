import React, { useState, useEffect } from 'react'
import Home from './components/Home'
import Subjects from './components/Subjects'

function App() {
    const [currentPage, setCurrentPage] = useState('home')
    const [username, setUsername] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [toasts, setToasts] = useState([])

    const showToast = (message, type = 'info') => {
        const id = Date.now()
        const needsAnimation = message.length > 30 // Only animate if message is long
        const newToast = { id, message, type, needsAnimation }
        setToasts(prev => [...prev, newToast])

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id))
        }, 3000)
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if (username !== 'Lionel Messi') {
            showToast('Access denied. Invalid username.', 'error')
            return
        }

        try {
            const response = await fetch('/api/subjects', {
                headers: { 'username': username }
            })

            if (response.ok) {
                setIsAuthenticated(true)
                localStorage.setItem('username', username)
                showToast(`Welcome back, ${username}!`, 'success')
            } else {
                const errorData = await response.json()
                showToast(errorData.error || 'Authentication failed', 'error')
            }
        } catch (error) {
            showToast('Failed to connect to server. Please make sure the backend is running.', error)
        }
    }

    const handleLogout = async () => {
        showToast('Logged out successfully', 'info')

        // Wait for toast duration (5 seconds) before logging out
        setTimeout(() => {
            setIsAuthenticated(false)
            setUsername('')
            localStorage.removeItem('username')
        }, 1000)
    }

    useEffect(() => {
        const savedUsername = localStorage.getItem('username')
        if (savedUsername === 'Lionel Messi') {
            setUsername(savedUsername)
            setIsAuthenticated(true)
        }
    }, [])

    // Add username to all fetch requests
    useEffect(() => {
        const originalFetch = window.fetch
        window.fetch = function (...args) {
            const [url, options = {}] = args
            if (url.startsWith('/api')) {
                options.headers = {
                    ...options.headers,
                    'username': username
                }
            }
            return originalFetch(url, options)
        }

        return () => {
            window.fetch = originalFetch
        }
    }, [username])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-700/50">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <img src="../public/Icon.png" alt="Icon" class="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                            Learning Tracker
                        </h1>
                        <p className="text-gray-400">Enter your username to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 px-1 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                                placeholder="Enter Username"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Access Application
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-900">
            {/* Toast Container */}
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 space-y-2 w-full max-w-md px-4 py-5">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`p-3 rounded-xl backdrop-blur-lg border shadow-lg animate-fadeIn overflow-hidden ${toast.type === 'error'
                            ? 'bg-red-500/20 border-red-500/30 text-red-300'
                            : toast.type === 'success'
                                ? 'bg-green-500/20 border-green-500/30 text-green-300'
                                : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <div className={`text-sm font-medium whitespace-nowrap ${toast.needsAnimation ? 'animate-slideText' : 'text-no-animation'
                                    }`}>
                                    {toast.message}
                                </div>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-3 text-xs opacity-70 hover:opacity-100 transition-opacity shrink-0"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <nav className="bg-gray-800/50 py-2 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                Welcome, {username}!
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-1 bg-gray-700/50 rounded-xl p-1 backdrop-blur-sm">
                                <button
                                    onClick={() => setCurrentPage('home')}
                                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === 'home'
                                        ? 'bg-linear-to-r from-cyan-500 to-purple-600 shadow-lg text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                                        }`}
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => setCurrentPage('subjects')}
                                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === 'subjects'
                                        ? 'bg-linear-to-r from-cyan-500 to-purple-600 shadow-lg text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                                        }`}
                                >
                                    Subjects
                                </button>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-gray-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl sticky mx-auto px-4 py-8 mt-4">
                <div className="py-6">
                    {currentPage === 'home' ? <Home showToast={showToast} /> : <Subjects showToast={showToast} />}
                </div>
            </main>
        </div>
    )
}

export default App;