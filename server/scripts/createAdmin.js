const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminModel = require('../models/Admin'); // Adjust path if needed

const adminEmail = 'admin@gmail.com'; // Replace with your admin email
const adminPassword = 'adminPassword';   // Replace with your admin password

mongoose.connect("mongodb://localhost:27017/MSUCampusGigs", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check if an admin already exists
        const existingAdmin = await AdminModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0); // Exit the script if admin already exists
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create a new admin
        const admin = new AdminModel({
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin created successfully');
        
        // Close the connection and exit the script
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });
