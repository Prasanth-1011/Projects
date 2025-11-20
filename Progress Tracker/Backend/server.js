import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = 5000;
const allowedOrigins = 'https://vercel.com/siva-prasanths-projects/progress-tracker/FFBJASDg8EsHuXqyA6xZbkhm8adz';

// Set up CORS options
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            // Allow requests with no origin (like mobile apps or Postman)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// Use CORS with your options
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://User:User@links.vjupjjr.mongodb.net/Learning-Tracker?retryWrites=true&w=majority')
    .then(console.log("Database connected succesfully"))
    .catch((error) => console.log(`Database connection error: ${error.message}`));;

// Subject Schema
const subjectSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Learning Entry Schema
const learningEntrySchema = new mongoose.Schema({
    username: { type: String, required: true },
    subjectName: { type: String, required: true },
    date: { type: String, required: true },
    topics: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Subject = mongoose.model('Subject', subjectSchema);
const LearningEntry = mongoose.model('LearningEntry', learningEntrySchema);

// Middleware to check username
const checkUsername = (req, res, next) => {
    const username = req.headers['username'];
    if (!username) {
        return res.status(401).json({ error: 'Username is required' });
    }
    if (username !== 'Lionel Messi') {
        return res.status(403).json({ error: 'Access denied. Invalid username.' });
    }
    req.username = username;
    next();
};

// Apply username check to all routes
app.use(checkUsername);

const baseUrl = 'https://vercel.com/siva-prasanths-projects/progress-tracker/FFBJASDg8EsHuXqyA6xZbkhm8adz';

// Get all subjects
app.get(`${baseUrl}/api/subjects`, async (req, res) => {
    try {
        const subjects = await Subject.find({ username: req.username }).sort({ createdAt: -1 });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

// Get learning entries grouped by subject
app.get(`${baseUrl}/api/learning-entries/grouped`, async (req, res) => {
    try {
        const entries = await LearningEntry.find({ username: req.username }).sort({ date: -1 });

        const entriesBySubject = entries.reduce((acc, entry) => {
            if (!acc[entry.subjectName]) {
                acc[entry.subjectName] = [];
            }
            acc[entry.subjectName].push(entry);
            return acc;
        }, {});

        res.json(entriesBySubject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch learning entries' });
    }
});

// Add new subject
app.post(`${baseUrl}/api/subjects`, async (req, res) => {
    try {
        const newSubject = new Subject({
            username: req.username,
            name: req.body.name
        });
        await newSubject.save();
        res.json(newSubject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create subject' });
    }
});

// Delete subject
app.delete(`${baseUrl}/api/subjects/:id`, async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({
            _id: req.params.id,
            username: req.username
        });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        // Delete all learning entries for this subject
        await LearningEntry.deleteMany({
            username: req.username,
            subjectName: subject.name
        });

        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subject' });
    }
});

// Add learning entry
app.post(`${baseUrl}/api/learning-entries`, async (req, res) => {
    try {
        const newEntry = new LearningEntry({
            username: req.username,
            ...req.body
        });
        await newEntry.save();
        res.json(newEntry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create learning entry' });
    }
});

// Delete learning entry
app.delete(`${baseUrl}/api/learning-entries/:id`, async (req, res) => {
    try {
        const entry = await LearningEntry.findOneAndDelete({
            _id: req.params.id,
            username: req.username
        });
        if (!entry) {
            return res.status(404).json({ error: 'Learning entry not found' });
        }
        res.json({ message: 'Learning entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete learning entry' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});