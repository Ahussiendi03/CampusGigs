const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
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
    id: {
        type: String, // This will store the path or URL to the uploaded ID
        required: true
    },
    birthCertificate: {
        type: String, // This will store the path or URL to the uploaded birth certificate
        required: true
    },
    campusAddress: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "parent"
    }
});

const ParentModel = mongoose.model('parent', ParentSchema);

module.exports = ParentModel;
