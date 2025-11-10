const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Cookies = require('js-cookie');
const ApplicantModel = require('./models/Applicant');
const EmployerModel = require('./models/Employer');
const ParentModel = require('./models/Parent');
const AdminModel = require('./models/Admin');
const jobPostRoutes = require('./routes/jobPosts');
const employerRoutes = require('./routes/jobPosts');
const applicationsRoutes = require('./routes/applications');
const applicantRoutes = require('./routes/applicantRoutes');
const registrationRoutes = require('./routes/registration');    
const feedbackRoute = require('./routes/feedback');
const applicantsLevel = require('./routes/applicants');
const tutorPostRoutes = require('./routes/tutorPosts');
const tutorApplicationsRoutes = require('./routes/tutorApplications');
const parentFeedbackRoutes = require('./routes/parentFeedback');
const applicantFeedbackRoutes = require('./routes/applicantFeedback');
const parentRoutes = require('./routes/parents');
const employer = require('./routes/employers');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/MSUCampusGigs");

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ status: "Error", message: "Unauthorized" });
    }
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "Error", message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};


// const authenticate = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ status: "Error", message: "Unauthorized: No token provided" });
//     }

//     jwt.verify(token, "jwt-secret-key", (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ status: "Error", message: "Unauthorized: Invalid token" });
//         }
//         req.user = decoded;
//         next();
//     });
// };





const generateToken = (user, role) => {
    const payload = { 
        email: user.email, 
        role: user.role 
    };

    // Add specific IDs based on the role
    if (role === "applicant") payload.applicantId = user._id;
    if (role === "employer") payload.employerId = user._id;
    if (role === "parent") payload.parentId = user._id;
    if (role === "admin") payload.adminId = user._id;

    return jwt.sign(payload, "jwt-secret-key", { expiresIn: "1d" });
};

app.use('/api/jobposts', jobPostRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api', applicantRoutes);
app.use('/api', registrationRoutes);
app.use('/api/feedback', feedbackRoute);
app.use('/api/applicants', applicantsLevel);
app.use('/api/tutorPosts', tutorPostRoutes);
app.use('/api/tutorApplication', tutorApplicationsRoutes);
app.use('/api/parent-feedback', parentFeedbackRoutes);
app.use('/api/applicant-feedback', applicantFeedbackRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/employer', employer);

// New API to fetch employer data
app.get('/api/employer/me', authenticate, (req, res) => {
    const email = req.user.email;
    EmployerModel.findOne({ email: email })
        .then(employer => {
            if (!employer) {
                return res.status(404).json({ status: "Error", message: "Employer not found" });
            }
            res.json(employer);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: "Error", message: "An error occurred while fetching employer data" });
        });
});

app.put('/api/employer/update', authenticate, (req, res) => {
    const email = req.user.email; // Extract email from authenticated user
    const updates = req.body; // Get the updates from the request body

    EmployerModel.findOneAndUpdate({ email: email }, updates, { new: true })
        .then(updatedEmployer => {
            if (!updatedEmployer) {
                return res.status(404).json({ status: "Error", message: "Employer not found" });
            }
            res.json(updatedEmployer);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: "Error", message: "An error occurred while updating employer data" });
        });
});


app.post("/sign-in", (req, res) => {
    const { email, password } = req.body;

    // Check in ApplicantModel
    ApplicantModel.findOne({ email: email })
        .then(applicant => {
            if (applicant) {
                // Check if the account is approved
                // if (applicant.status !== 'approved') {
                //     return res.json({ status: "Error", message: "Your account is not approved yet." });
                // }

                bcrypt.compare(password, applicant.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign(
                            { email: applicant.email, role: applicant.role, applicantId: applicant._id },
                            "jwt-secret-key",
                        );
                        res.cookie("token", token);
                        res.json({ status: "Success", role: applicant.role, applicantId: applicant._id });
                    } else {
                        res.json({ status: "Error", message: "The password is incorrect" });
                    }
                });
            } else {
                // Check in EmployerModel if not found in ApplicantModel
                EmployerModel.findOne({ email: email })
                    .then(employer => {
                        if (employer) {
                            // Check if the account is approved
                            // if (employer.status !== 'approved') {
                            //     return res.json({ status: "Error", message: "Your account is not approved yet." });
                            // }

                            bcrypt.compare(password, employer.password, (err, response) => {
                                if (response) {
                                    const token = jwt.sign(
                                        { email: employer.email, role: employer.role, employerId: employer._id },
                                        "jwt-secret-key",
                                    );
                                    res.cookie("token", token);
                                    res.json({ status: "Success", role: employer.role, employerId: employer._id });
                                } else {
                                    res.json({ status: "Error", message: "The password is incorrect" });
                                }
                            });
                        } else {
                            // Check in ParentModel if not found in EmployerModel
                            ParentModel.findOne({ email: email })
                                .then(parent => {
                                    if (parent) {
                                        // Check if the account is approved
                                        // if (parent.status !== 'approved') {
                                        //     return res.json({ status: "Error", message: "Your account is not approved yet." });
                                        // }

                                        bcrypt.compare(password, parent.password, (err, response) => {
                                            if (response) {
                                                const token = jwt.sign(
                                                    { email: parent.email, role: parent.role, parentId: parent._id },
                                                    "jwt-secret-key",
                                                );
                                                res.cookie("token", token);
                                                res.json({ status: "Success", role: parent.role, parentId: parent._id });
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



// app.post("/sign-in", (req, res) => {
//     const { email, password } = req.body;

//     // Check in ApplicantModel
//     ApplicantModel.findOne({ email: email })
//         .then(applicant => {
//             if (applicant) {
//                 bcrypt.compare(password, applicant.password, (err, response) => {
//                     if (response) {
//                         const token = jwt.sign(
//                             { email: applicant.email, role: applicant.role, applicantId: applicant._id },
//                             "jwt-secret-key",
//                         );
//                         res.cookie("token", token);
//                         res.json({ status: "Success", role: applicant.role, applicantId: applicant._id });
//                     } else {
//                         res.json({ status: "Error", message: "The password is incorrect" });
//                     }
//                 });
//             } else {
//                 // Check in EmployerModel if not found in ApplicantModel
//                 EmployerModel.findOne({ email: email })
//                     .then(employer => {
//                         if (employer) {
//                             bcrypt.compare(password, employer.password, (err, response) => {
//                                 if (response) {
//                                     const token = jwt.sign(
//                                         { email: employer.email, role: employer.role, employerId: employer._id }, // Include employerId in the token
//                                         "jwt-secret-key",
//                                     );
//                                     res.cookie("token", token);
//                                     res.json({ status: "Success", role: employer.role, employerId: employer._id }); // Send employerId in the response
//                                 } else {
//                                     res.json({ status: "Error", message: "The password is incorrect" });
//                                 }
//                             });
//                         } else {
//                             // Check in ParentModel if not found in EmployerModel
//                             ParentModel.findOne({ email: email })
//                                 .then(parent => {
//                                     if (parent) {
//                                         bcrypt.compare(password, parent.password, (err, response) => {
//                                             if (response) {
//                                                 const token = jwt.sign(
//                                                     { email: parent.email, role: parent.role },
//                                                     "jwt-secret-key",
//                                                 );
//                                                 res.cookie("token", token);
//                                                 res.json({ status: "Success", role: parent.role });
//                                             } else {
//                                                 res.json({ status: "Error", message: "The password is incorrect" });
//                                             }
//                                         });
//                                     } else {
//                                         // Check in AdminModel if not found in ParentModel
//                                         AdminModel.findOne({ email: email })
//                                             .then(admin => {
//                                                 if (admin) {
//                                                     bcrypt.compare(password, admin.password, (err, response) => {
//                                                         if (response) {
//                                                             const token = jwt.sign(
//                                                                 { email: admin.email, role: admin.role },
//                                                                 "jwt-secret-key",
//                                                             );
//                                                             res.cookie("token", token);
//                                                             res.json({ status: "Success", role: admin.role });
//                                                         } else {
//                                                             res.json({ status: "Error", message: "The password is incorrect" });
//                                                         }
//                                                     });
//                                                 } else {
//                                                     res.json({ status: "Error", message: "No record existed" });
//                                                 }
//                                             })
//                                             .catch(err => {
//                                                 console.log(err);
//                                                 res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
//                                             });
//                                     }
//                                 })
//                                 .catch(err => {
//                                     console.log(err);
//                                     res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
//                                 });
//                         }
//                     })
//                     .catch(err => {
//                         console.log(err);
//                         res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
//                     });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ status: "Error", message: "An error occurred while processing your request" });
//         });
// });


app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ status: "Success", message: "Logged out successfully" });
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



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


app.post('/employerRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'businessPermit', maxCount: 1 },
    { name: 'id', maxCount: 1 },
    { name: 'businessImage', maxCount: 1 }
]), (req, res) => {
    const { firstName, lastName, email, password, contactNumber, streetAddress, businessName } = req.body;

    // Ensure files are present before accessing
    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].path : null;
    const businessPermit = req.files['businessPermit'] ? req.files['businessPermit'][0].path : null;
    const id = req.files['id'] ? req.files['id'][0].path : null;
    const businessImage = req.files['businessImage'] ? req.files['businessImage'][0].path : null;

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
                businessImage,
                contactNumber,
                businessName,
                streetAddress,
                status: 'pending' // Set default status to pending
            })
                .then(user => res.json({
                    message: "Registration successful. Your account is pending admin approval.",
                    userId: user._id, // Optionally return the user ID
                    status: user.status // Return the status for front-end display
                }))
                .catch(err => {
                    console.error('Error creating user:', err);
                    res.status(400).json({ message: 'Error creating user', error: err });
                });
        })
        .catch(err => {
            console.error('Error hashing password:', err);
            res.status(500).json({ message: 'Error hashing password', error: err });
        });
});


// Employer Register Endpoint
// app.post('/employerRegister', upload.fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'businessPermit', maxCount: 1 },
//     { name: 'id', maxCount: 1 },
//     { name: 'businessImage', maxCount: 1}
//   ]), (req, res) => {
//     const { firstName, lastName, email, password, contactNumber, streetAddress, businessName } = req.body;
  
//     // Ensure files are present before accessing
//     const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].path : null;
//     const businessPermit = req.files['businessPermit'] ? req.files['businessPermit'][0].path : null;
//     const id = req.files['id'] ? req.files['id'][0].path : null;
//     const businessImage = req.files['businessImage'] ? req.files['businessImage'][0].path : null;
  
//     bcrypt.hash(password, 10)
//       .then(hash => {
//         EmployerModel.create({
//           firstName,
//           lastName,
//           email,
//           password: hash,
//           profilePicture,
//           businessPermit,
//           id,
//           businessImage,
//           contactNumber,
//           businessName,
//           streetAddress
//         })
//         .then(user => res.json("Success"))
//         .catch(err => {
//           console.error('Error creating user:', err);
//           res.status(400).json({ message: 'Error creating user', error: err });
//         });
//       })
//       .catch(err => {
//         console.error('Error hashing password:', err);
//         res.status(500).json({ message: 'Error hashing password', error: err });
//       });
//   });
  
app.post('/applicantRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'cor', maxCount: 1 },
    { name: 'schoolId', maxCount: 1 }
]), async (req, res) => {
    try {
        const { firstName, lastName, email, password, streetAddress } = req.body;
        const profilePicture = req.files['profilePicture'][0].path;
        const cor = req.files['cor'][0].path;
        const schoolId = req.files['schoolId'][0].path;

        // Check if email already exists
        const existingApplicant = await ApplicantModel.findOne({ email });
        if (existingApplicant) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new applicant with 'pending' status
        const newApplicant = await ApplicantModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePicture,
            cor,
            schoolId,
            streetAddress,
            status: 'pending'  // Applicant must be approved by admin
        });

        res.status(201).json({ message: "Registration successful! Waiting for admin approval." });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});


// Applicant Register Endpoint
// app.post('/applicantRegister', upload.fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'cor', maxCount: 1 },
//     { name: 'schoolId', maxCount: 1 }
// ]), (req, res) => {
//     const { firstName, lastName, email, password, streetAddress } = req.body;
//     const profilePicture = req.files['profilePicture'][0].path;
//     const cor = req.files['cor'][0].path;
//     const schoolId = req.files['schoolId'][0].path;

//     bcrypt.hash(password, 10)
//         .then(hash => {
//             ApplicantModel.create({
//                 firstName,
//                 lastName,
//                 email,
//                 password: hash,
//                 profilePicture,
//                 cor,
//                 schoolId,
//                 streetAddress
//             })
//             .then(user => res.json("Success"))
//             .catch(err => res.status(400).json(err));
//         }).catch(err => res.status(500).json(err));
// });

app.post('/parentRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'id', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 }
]), async (req, res) => {
    try {
        const { firstName, lastName, email, password, campusAddress, contactNumber, houseNumber } = req.body;
        const profilePicture = req.files['profilePicture'][0].path;
        const id = req.files['id'][0].path;
        const birthCertificate = req.files['birthCertificate'][0].path;

        // Check if email already exists
        const existingParent = await ParentModel.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new parent with 'pending' status
        const newParent = await ParentModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePicture,
            id,
            birthCertificate,
            campusAddress,
            contactNumber,
            houseNumber,
            status: 'pending'  // Parent must be approved by admin
        });

        res.status(201).json({ message: "Registration successful! Waiting for admin approval." });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});


// app.post('/parentRegister', upload.fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'id', maxCount: 1 },
//     { name: 'birthCertificate', maxCount: 1 }
// ]), (req, res) => {
//     const { firstName, lastName, email, password, campusAddress, contactNumber, houseNumber } = req.body;
//     const profilePicture = req.files['profilePicture'][0].path;
//     const id = req.files['id'][0].path;
//     const birthCertificate = req.files['birthCertificate'][0].path;

//     // Hash the password
//     bcrypt.hash(password, 10)
//         .then(hash => {
//             // Create a new parent document in the database
//             ParentModel.create({
//                 firstName,
//                 lastName,
//                 email,
//                 password: hash,
//                 profilePicture,
//                 id,
//                 birthCertificate,
//                 campusAddress,
//                 contactNumber,
//                 houseNumber
//             })
//             .then(user => res.json("Success"))
//             .catch(err => res.status(400).json(err));
//         }).catch(err => res.status(500).json(err));
// });



app.listen(5000, () => {
    console.log("server is running");
    
});