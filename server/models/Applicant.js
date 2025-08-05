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
        type: String,
        required: true
    },
    cor: {
        type: String,
        required: true
    },
    schoolId: {
        type: String,
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
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    experience: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        default: 'Beginner'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ApplicantModel = mongoose.model('applicant', ApplicantSchema);

module.exports = ApplicantModel;
