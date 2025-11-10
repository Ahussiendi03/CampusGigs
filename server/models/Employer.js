const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String, // This will store the path or URL to the uploaded profile picture
        required: true
    },
    businessPermit: {
        type: String, // This will store the path or URL to the uploaded Business Permit
        required: true
    },
    id: {
        type: String, // This will store the path or URL to the uploaded ID
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    businessImage: {
        type: String,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "employer"
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Restrict values to these statuses
        default: 'pending' // Default status is 'pending' until approved by an admin
    },
    rejectionReason: { // 👈 store rejection reason
        type: String,
        default: null 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    savedPositions: {
        type: [String],
        default: [],
      }
});

const EmployerModel = mongoose.model('employer', EmployerSchema);

module.exports = EmployerModel;