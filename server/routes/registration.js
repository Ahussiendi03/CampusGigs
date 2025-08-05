const express = require('express');
const router = express.Router();
const EmployerModel = require('../models/Employer');
const ApplicantModel = require('../models/Applicant');
const ParentModel = require('../models/Parent');

router.get('/users', async (req, res) => {
    try {
        const { status } = req.query;

        const query = status ? { status } : {}; // No filter if status not provided

        const employers = await EmployerModel.find(query);
        const applicants = await ApplicantModel.find(query);
        const parents = await ParentModel.find(query);

        res.json([
            ...employers.map(e => ({ ...e.toObject(), role: 'employer' })),
            ...applicants.map(a => ({ ...a.toObject(), role: 'applicant' })),
            ...parents.map(p => ({ ...p.toObject(), role: 'parent' })),
        ]);
    } catch (err) {
        console.error('Error fetching users by status:', err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});
// Fetch pending users
router.get('/users/pending', async (req, res) => {
    try {
        const pendingEmployers = await EmployerModel.find({ status: 'pending' });
        const pendingApplicants = await ApplicantModel.find({ status: 'pending' });
        const pendingParents = await ParentModel.find({ status: 'pending' });

        res.json([
            ...pendingEmployers.map(e => ({ ...e.toObject(), role: 'employer' })),
            ...pendingApplicants.map(a => ({ ...a.toObject(), role: 'applicant' })),
            ...pendingParents.map(p => ({ ...p.toObject(), role: 'parent' })),
        ]);
    } catch (err) {
        console.error('Error fetching pending users:', err);
        res.status(500).json({ message: 'Error fetching pending users', error: err.message });
    }
});

// Update user status
router.put('/registrations/status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        let updatedUser = await EmployerModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedUser) updatedUser = await ApplicantModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedUser) updatedUser = await ParentModel.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

        res.json({ message: 'Status updated successfully.', user: updatedUser });
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ message: 'Failed to update status.', error: err.message });
    }
});

module.exports = router;
