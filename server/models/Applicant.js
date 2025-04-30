const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
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
    cor: {
        type: String, // This will store the path or URL to the uploaded COR
        required: true
    },
    schoolId: {
        type: String, // This will store the path or URL to the uploaded School ID
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "applicant"
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Restrict values to these statuses
        default: 'pending' // Default status is 'pending' until approved by an admin
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ApplicantModel = mongoose.model('applicant', ApplicantSchema);

module.exports = ApplicantModel;
