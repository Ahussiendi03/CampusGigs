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
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "applicant"
    }
});

const ApplicantModel = mongoose.model('applicant', ApplicantSchema);

module.exports = ApplicantModel;
