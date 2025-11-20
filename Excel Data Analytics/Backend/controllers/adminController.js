const Admin = require('../models/Admin');
const User = require('../models/User');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');

exports.getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await Admin.find({ status: 'pending' }).select('-password');
        res.json(pendingAdmins);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.activateAdmin = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.status = 'active';
        await admin.save();

        res.json({ message: 'Admin activated successfully', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.promoteToRoot = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.root = true;
        await admin.save();

        res.json({ message: 'Admin promoted to root successfully', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.revokeRoot = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.root = false;
        await admin.save();

        res.json({ message: 'Root privileges revoked successfully', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deactivateUser = async (req, res) => {
    const { userId } = req.params;

    try {
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllFiles = async (req, res) => {
    try {
        const files = await File.find().populate('userId', 'username email');
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserActivity = async (req, res) => {
    try {
        const activities = await ActivityLog.find()
            .populate('userId', 'username email')
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await Admin.countDocuments();
        const totalFiles = await File.countDocuments();
        const pendingAdmins = await Admin.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            totalAdmins,
            totalFiles,
            pendingAdmins
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};