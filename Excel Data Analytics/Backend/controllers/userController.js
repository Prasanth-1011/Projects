const User = require('../models/User');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserFiles = async (req, res) => {
    try {
        const files = await File.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const fileCount = await File.countDocuments({ userId: req.user.id });

        res.json({
            filesUploaded: user.filesUploaded,
            visualizationsAccessed: user.visualizationsAccessed,
            chartsDownloaded: user.chartsDownloaded,
            totalFiles: fileCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.incrementVisualization = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.visualizationsAccessed += 1;
        await user.save();

        await ActivityLog.create({
            userId: req.user.id,
            action: 'visualization_accessed',
            details: req.body.visualizationType
        });

        res.json({ message: 'Visualization count updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.incrementDownload = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.chartsDownloaded += 1;
        await user.save();

        await ActivityLog.create({
            userId: req.user.id,
            action: 'chart_downloaded',
            details: req.body.chartType
        });

        res.json({ message: 'Download count updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};