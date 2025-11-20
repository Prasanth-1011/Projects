import React, { useState, useEffect } from 'react'

const Subjects = ({ showToast }) => {
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [newSubjectName, setNewSubjectName] = useState('')
    const [newEntry, setNewEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        topics: '',
        description: ''
    })
    const [learningEntries, setLearningEntries] = useState([])

    useEffect(() => {
        fetchSubjects()
    }, [])

    useEffect(() => {
        if (selectedSubject) {
            fetchLearningEntries(selectedSubject.name)
        }
    }, [selectedSubject])

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects')
            if (!response.ok) throw new Error('Failed to fetch subjects')
            const data = await response.json()
            setSubjects(data)
        } catch (error) {
            showToast('Failed to load subjects', error)
        }
    }

    const fetchLearningEntries = async (subjectName) => {
        try {
            const response = await fetch(`/api/learning-entries/grouped`)
            if (!response.ok) throw new Error('Failed to fetch learning entries')
            const data = await response.json()
            setLearningEntries(data[subjectName] || [])
        } catch (error) {
            showToast('Failed to load learning entries', error)
        }
    }

    const handleAddSubject = async (e) => {
        e.preventDefault()
        if (!newSubjectName.trim()) {
            showToast('Subject name is required', 'error')
            return
        }

        try {
            const response = await fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubjectName.trim() })
            })
            if (!response.ok) throw new Error('Failed to create subject')

            showToast('Subject created successfully', 'success')
            setNewSubjectName('')
            fetchSubjects()
        } catch (error) {
            showToast('Failed to create subject', error)
        }
    }

    const handleDeleteSubject = async (subjectId) => {
        try {
            const response = await fetch(`/api/subjects/${subjectId}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete subject')

            showToast('Subject deleted successfully', 'success')
            if (selectedSubject && selectedSubject._id === subjectId) {
                setSelectedSubject(null)
                setLearningEntries([])
            }
            fetchSubjects()
        } catch (error) {
            showToast('Failed to delete subject', error)
        }
    }

    const handleAddLearningEntry = async (e) => {
        e.preventDefault()
        if (!selectedSubject) {
            showToast('Please select a subject first', 'error')
            return
        }
        if (!newEntry.topics.trim() || !newEntry.description.trim()) {
            showToast('Topics and description are required', 'error')
            return
        }

        try {
            const response = await fetch('/api/learning-entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subjectName: selectedSubject.name,
                    date: newEntry.date,
                    topics: newEntry.topics.trim(),
                    description: newEntry.description.trim()
                })
            })
            if (!response.ok) throw new Error('Failed to add learning entry')

            showToast('Learning entry added successfully', 'success')
            setNewEntry({
                date: new Date().toISOString().split('T')[0],
                topics: '',
                description: ''
            })
            fetchLearningEntries(selectedSubject.name)
        } catch (error) {
            showToast('Failed to add learning entry', error)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.')
    }

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
                Manage Subjects & Entries
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Subjects */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Add Subject */}
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-gray-700/50">
                        <h2 className="text-lg font-bold text-white mb-3">Add New Subject</h2>
                        <form onSubmit={handleAddSubject} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-sm"
                                    placeholder="e.g., Java, Data Structures, JavaScript"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                                Add Subject
                            </button>
                        </form>
                    </div>

                    {/* Subjects List */}
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-gray-700/50">
                        <h2 className="text-lg font-bold text-white mb-3">Your Subjects</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {subjects.map((subject, index) => (
                                <div
                                    key={subject._id}
                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm ${selectedSubject?._id === subject._id
                                        ? 'border-cyan-500 bg-cyan-500/20'
                                        : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                                        } animate-slideIn`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => setSelectedSubject(subject)}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-white text-sm">{subject.name}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteSubject(subject._id)
                                            }}
                                            className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {subjects.length === 0 && (
                                <div className="text-center py-6 text-gray-400">
                                    <p className="text-xs">No subjects yet. Create your first subject!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Learning Entries */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Add Learning Entry */}
                    {selectedSubject && (
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-gray-700/50">
                            <h2 className="text-lg font-bold text-white mb-3">
                                Add Learning Entry for {selectedSubject.name}
                            </h2>
                            <form onSubmit={handleAddLearningEntry} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newEntry.date}
                                        onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all duration-300 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Topics
                                    </label>
                                    <input
                                        type="text"
                                        value={newEntry.topics}
                                        onChange={(e) => setNewEntry({ ...newEntry, topics: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-sm"
                                        placeholder="e.g., Arrays, Linked List, Trees"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={newEntry.description}
                                        onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none text-sm"
                                        placeholder="Describe what you learned in detail..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-linear-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                                >
                                    Add Learning Entry
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Learning Entries List */}
                    {selectedSubject && (
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-gray-700/50">
                            <h2 className="text-lg font-bold text-white mb-3">
                                Learning Entries for {selectedSubject.name}
                            </h2>
                            <div className="space-y-3">
                                {learningEntries.length > 0 ? (
                                    learningEntries.map((entry, index) => (
                                        <div
                                            key={entry._id}
                                            className="p-3 border border-gray-600/50 rounded-lg bg-gray-700/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 animate-fadeIn"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-base font-bold text-cyan-400">
                                                    Date - {formatDate(entry.date)}
                                                </h3>
                                            </div>
                                            <p className="font-medium text-white text-sm mb-1">Topics: {entry.topics}</p>
                                            <p className="text-gray-300 text-xs">Description: {entry.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <div className="text-2xl mb-2">📖</div>
                                        <p className="text-xs">No learning entries yet. Add your first entry above!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!selectedSubject && (
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-700/50 text-center">
                            <h2 className="text-lg font-bold text-cyan-300 mb-2">Select a Subject</h2>
                            <p className="text-gray-400 text-sm">Choose a subject from the list to add and view learning entries</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Subjects;