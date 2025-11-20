const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedRootAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/excel-analytics');

        const existingRoot = await Admin.findOne({ root: true });

        if (existingRoot) {
            console.log('Root admin already exists!');
            console.log('Email:', existingRoot.email);
        }

        const hashedPassword = await bcrypt.hash('Zidio', 10);

        const rootAdmin = new Admin({
            username: 'Zidio Development',
            email: 'zidio@admin.com',
            password: hashedPassword,
            root: true,
            status: 'active'
        });

        await rootAdmin.save();

        console.log('Root admin created successfully!');
        console.log('Email: zidio@admin.com');
        console.log('Password: Zidio');
        console.log('Please change the password after first login!');
    } catch (error) {

    }
};

seedRootAdmin();