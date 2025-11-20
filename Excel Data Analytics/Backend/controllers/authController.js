const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const Model = role === 'admin' ? Admin : User;

        const existingUser = await Model.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Model({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = generateToken(newUser._id, role);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role,
                status: role === 'admin' ? newUser.status : undefined,
                root: role === 'admin' ? newUser.root : undefined
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const Model = role === 'admin' ? Admin : User;
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, role);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role,
                status: role === 'admin' ? user.status : undefined,
                root: role === 'admin' ? user.root : undefined
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const Model = req.user.role === 'admin' ? Admin : User;
        const user = await Model.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

exports.verifyUser = async (req, res) => {
    const { username, email } = req.body;

    try {
        let user = await User.findOne({ username, email });

        if (!user) {
            user = await Admin.findOne({ username, email });
        }

        if (!user) {
            return res.status(404).json({ message: 'No account found with this username and email combination' });
        }

        res.json({
            message: 'User verified successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { username, email, newPassword } = req.body;

    try {
        let user = await User.findOne({ username, email });

        if (!user) {
            user = await Admin.findOne({ username, email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const Model = req.user.role === 'admin' ? Admin : User;
        const user = await Model.findById(req.user.id).select('-password');

        res.json({
            user: {
                ...user.toObject(),
                role: req.user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};