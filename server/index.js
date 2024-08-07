const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApplicantModel = require('./models/Applicant');
const EmployerModel = require('./models/Employer');
const ParentModel = require('./models/Parent');
const AdminModel = require('./models/Admin');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());


app.post("/sign-in", (req, res) => {
    const { email, password } = req.body;

    // Check in ApplicantModel
    ApplicantModel.findOne({ email: email })
        .then(applicant => {
            if (applicant) {
                bcrypt.compare(password, applicant.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign(
                            { email: applicant.email, role: applicant.role },
                            "jwt-secret-key",
                            { expiresIn: '1d' }
                        );
                        res.cookie("token", token);
                        res.json({ status: "Success", role: applicant.role });
                    } else {
                        res.json({ status: "Error", message: "The password is incorrect" });
                    }
                });
            } else {
                // Check in EmployerModel if not found in ApplicantModel
                EmployerModel.findOne({ email: email })
                    .then(employer => {
                        if (employer) {
                            bcrypt.compare(password, employer.password, (err, response) => {
                                if (response) {
                                    const token = jwt.sign(
                                        { email: employer.email, role: employer.role },
                                        "jwt-secret-key",
                                        { expiresIn: '1d' }
                                    );
                                    res.cookie("token", token);
                                    res.json({ status: "Success", role: employer.role });
                                } else {
                                    res.json({ status: "Error", message: "The password is incorrect" });
                                }
                            });
                        } else {
                            // Check in ParentModel if not found in EmployerModel
                            ParentModel.findOne({ email: email })
                                .then(parent => {
                                    if (parent) {
                                        bcrypt.compare(password, parent.password, (err, response) => {
                                            if (response) {
                                                const token = jwt.sign(
                                                    { email: parent.email, role: parent.role },
                                                    "jwt-secret-key",
                                                    { expiresIn: '1d' }
                                                );
                                                res.cookie("token", token);
                                                res.json({ status: "Success", role: parent.role });
                                            } else {
                                                res.json({ status: "Error", message: "The password is incorrect" });
                                            }
                                        });
                                    } else {
                                        // Check in AdminModel if not found in ParentModel
                                        AdminModel.findOne({ email: email })
                                            .then(admin => {
                                                if (admin) {
                                                    bcrypt.compare(password, admin.password, (err, response) => {
                                                        if (response) {
                                                            const token = jwt.sign(
                                                                { email: admin.email, role: admin.role },
                                                                "jwt-secret-key",
                                                                { expiresIn: '1d' }
                                                            );
                                                            res.cookie("token", token);
                                                            res.json({ status: "Success", role: admin.role });
                                                        } else {
                                                            res.json({ status: "Error", message: "The password is incorrect" });
                                                        }
                                                    });
                                                } else {
                                                    res.json({ status: "Error", message: "No record existed" });
                                                }
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
                                            });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
        });
});




mongoose.connect("mongodb://localhost:27017/MSUCampusGigs");

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Employer Register Endpoint
app.post('/employerRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'businessPermit', maxCount: 1 },
    { name: 'id', maxCount: 1 }
  ]), (req, res) => {
    const { firstName, lastName, email, password, streetAddress } = req.body;
    const profilePicture = req.files['profilePicture'][0].path;
    const businessPermit = req.files['businessPermit'][0].path;
    const id = req.files['id'][0].path;
  
    bcrypt.hash(password, 10)
      .then(hash => {
        EmployerModel.create({
          firstName,
          lastName,
          email,
          password: hash,
          profilePicture,
          businessPermit,
          id,
          streetAddress
        })
        .then(user => res.json("Success"))
        .catch(err => res.status(400).json(err));
      }).catch(err => res.status(500).json(err));
  });

// Applicant Register Endpoint
app.post('/applicantRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'cor', maxCount: 1 },
    { name: 'schoolId', maxCount: 1 }
]), (req, res) => {
    const { firstName, lastName, email, password, address } = req.body;
    const profilePicture = req.files['profilePicture'][0].path;
    const cor = req.files['cor'][0].path;
    const schoolId = req.files['schoolId'][0].path;

    bcrypt.hash(password, 10)
        .then(hash => {
            ApplicantModel.create({
                firstName,
                lastName,
                email,
                password: hash,
                profilePicture,
                cor,
                schoolId,
                address
            })
            .then(user => res.json("Success"))
            .catch(err => res.status(400).json(err));
        }).catch(err => res.status(500).json(err));
});

app.post('/parentRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'id', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 }
]), (req, res) => {
    const { firstName, lastName, email, password, campusAddress } = req.body;
    const profilePicture = req.files['profilePicture'][0].path;
    const id = req.files['id'][0].path;
    const birthCertificate = req.files['birthCertificate'][0].path;

    // Hash the password
    bcrypt.hash(password, 10)
        .then(hash => {
            // Create a new parent document in the database
            ParentModel.create({
                firstName,
                lastName,
                email,
                password: hash,
                profilePicture,
                id,
                birthCertificate,
                campusAddress
            })
            .then(user => res.json("Success"))
            .catch(err => res.status(400).json(err));
        }).catch(err => res.status(500).json(err));
});

app.listen(5000, () => {
    console.log("server is running");
});