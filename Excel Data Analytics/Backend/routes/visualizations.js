const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const File = require('../models/File');
const stats = require('simple-statistics');

router.post('/statistics', authMiddleware, async (req, res) => {
    try {
        const { data, column } = req.body;

        if (!data || !column) {
            return res.status(400).json({ message: 'Data and column are required' });
        }

        const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));

        if (values.length === 0) {
            return res.status(400).json({ message: 'No numeric data found in column' });
        }

        const statistics = {
            mean: stats.mean(values),
            median: stats.median(values),
            min: stats.min(values),
            max: stats.max(values),
            standardDeviation: stats.standardDeviation(values),
            variance: stats.variance(values),
            quantiles: stats.quantile(values, [0.25, 0.5, 0.75])
        };

        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;