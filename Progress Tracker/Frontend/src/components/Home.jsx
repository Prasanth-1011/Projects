import React, { useState, useEffect } from 'react'

const Home = ({ showToast }) => {
    const [subjects, setSubjects] = useState([])
    const [learningEntries, setLearningEntries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [subjectsRes, entriesRes] = await Promise.all([
                fetch('/api/subjects'),
                fetch('/api/learning-entries/grouped')
            ])

            if (!subjectsRes.ok || !entriesRes.ok) {
                throw new Error('Failed to fetch data')
            }

            const subjectsData = await subjectsRes.json()
            const entriesData = await entriesRes.json()

            setSubjects(subjectsData)

            // Transform the data to group by date first, then by subject
            const entriesByDate = transformEntriesByDate(entriesData)
            setLearningEntries(entriesByDate)

        } catch (error) {
            showToast('Failed to load data', error)
        } finally {
            setLoading(false)
        }
    }

    const transformEntriesByDate = (entriesBySubject) => {
        const entriesByDate = {}

        // Loop through each subject and its entries
        Object.entries(entriesBySubject).forEach(([subjectName, entries]) => {
            entries.forEach(entry => {
                const date = entry.date

                if (!entriesByDate[date]) {
                    entriesByDate[date] = {}
                }

                if (!entriesByDate[date][subjectName]) {
                    entriesByDate[date][subjectName] = []
                }

                entriesByDate[date][subjectName].push(entry)
            })
        })

        return entriesByDate
    }

    const handleDeleteEntry = async (entryId) => {
        try {
            const response = await fetch(`/api/learning-entries/${entryId}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete entry')
            showToast('Learning entry deleted successfully', 'success')
            fetchData()
        } catch (error) {
            showToast('Failed to delete learning entry', error)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.')
    }

    // Proper sorting by year, month, day in ascending order
    const getSortedDates = (entriesByDate) => {
        return Object.entries(entriesByDate).sort(([dateA], [dateB]) => {
            const [yearA, monthA, dayA] = dateA.split('-').map(Number)
            const [yearB, monthB, dayB] = dateB.split('-').map(Number)

            // Compare years first
            if (yearA !== yearB) {
                return yearA - yearB // Ascending order for years
            }

            // If same year, compare months
            if (monthA !== monthB) {
                return monthA - monthB // Ascending order for months
            }

            // If same year and month, compare days
            return dayA - dayB // Ascending order for days
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-lg text-cyan-300">Loading your learning progress...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Learning Progress
                </h1>
                <button
                    onClick={fetchData}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-gray-600 text-sm"
                >
                    Refresh
                </button>
            </div>

            {/* Learning Entries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSortedDates(learningEntries).map(([date, subjectsOnDate]) => (
                    <div
                        key={date}
                        className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-lg hover:scale-105 transition-transform duration-300 animate-fadeIn"
                    >
                        {/* Date Header */}
                        <div className="mb-4 pb-3 border-b border-gray-600/50">
                            <h2 className="text-lg font-bold text-cyan-400">
                                Date - {formatDate(date)}
                            </h2>
                        </div>

                        {/* Subjects and Topics */}
                        <div className="space-y-3">
                            {Object.entries(subjectsOnDate).map(([subjectName, entries]) => (
                                <div key={subjectName} className="space-y-2">
                                    {/* Subject Name */}
                                    <h3 className="text-base font-semibold text-white flex items-center">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                                        {subjectName}
                                    </h3>

                                    {/* Topics for this subject */}
                                    <div className="ml-4 space-y-1">
                                        {entries.map((entry) => (
                                            <div
                                                key={entry._id}
                                                className="flex justify-between items-start group hover:bg-gray-700/30 px-2 py-1 rounded-lg transition-all duration-200"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-300">
                                                        <span className="font-medium text-purple-400 text-xs">Topics:</span> {entry.topics}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteEntry(entry._id)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs transition-all duration-200 ml-2"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {Object.keys(learningEntries).length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                        <div className="text-cyan-300 text-lg mb-2">No records found.</div>
                        <div className="text-gray-400 text-sm">Add records to track the daily progress!</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;