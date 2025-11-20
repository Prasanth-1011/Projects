const Admin = require('../models/Admin');

const requireAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin || admin.status !== 'active') {
            return res.status(403).json({ message: 'Admin account is not active' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const requireRoot = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Root admin only.' });
    }

    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin || !admin.root || admin.status !== 'active') {
            return res.status(403).json({ message: 'Access denied. Root admin privileges required.' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { requireAdmin, requireRoot };