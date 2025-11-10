const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true }, 
    id: { type: String, required: true },
    birthCertificate: { type: String, required: true },
    houseNumber: { type: String, required: true },
    contactNumber: { type: String, required: true },
    campusAddress: { type: String, required: true },
    role: { type: String, default: "parent" },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Admin approval
    rejectionReason: { // 👈 store rejection reason
        type: String,
        default: null 
    },
    createdAt: { type: Date, default: Date.now }
});

const ParentModel = mongoose.model('parent', ParentSchema);
module.exports = ParentModel;
