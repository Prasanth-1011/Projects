require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Bookmark = require('./models/Bookmark');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

// GET all groups for a user
app.get('/groups/:userId', async (req, res) => {
    const groups = await Bookmark.find({ userId: req.params.userId });
    res.json(groups);
});

// POST new group
app.post('/groups', async (req, res) => {
    const newGroup = new Bookmark(req.body);
    await newGroup.save();
    res.json({ success: true });
});

// PUT update group
app.put('/groups/:id', async (req, res) => {
    await Bookmark.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
});

// DELETE group
app.delete('/groups/:id', async (req, res) => {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
