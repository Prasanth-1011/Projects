const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const { parseExcelFile } = require('../services/excelParser');
const File = require('../models/File');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only .xlsx and .xls files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const parsedResult = parseExcelFile(req.file.path);

        if (!parsedResult.success) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Failed to parse Excel file', error: parsedResult.error });
        }

        const newFile = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            userId: req.user.id,
            parsedData: parsedResult.data
        });

        await newFile.save();

        await User.findByIdAndUpdate(req.user.id, { $inc: { filesUploaded: 1 } });

        await ActivityLog.create({
            userId: req.user.id,
            action: 'file_uploaded',
            details: req.file.originalname
        });

        res.json({
            message: 'File uploaded and parsed successfully',
            file: newFile,
            parsedData: parsedResult.data,
            totalRows: parsedResult.totalRows
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/file/:fileId', authMiddleware, async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(file);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/file/:fileId', authMiddleware, async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        await File.findByIdAndDelete(req.params.fileId);

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router