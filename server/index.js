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
const applicationsRouter = require('./routes/applications');


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

app.use('/api/jobposts', jobPostRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/applications', applicationsRouter);




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
                bcrypt.compare(password, applicant.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign(
                            { email: applicant.email, role: applicant.role },
                            "jwt-secret-key",
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
                                        { email: employer.email, role: employer.role, employerId: employer._id }, // Include employerId in the token
                                        "jwt-secret-key",
                                    );
                                    res.cookie("token", token);
                                    res.json({ status: "Success", role: employer.role, employerId: employer._id }); // Send employerId in the response
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


/*const token = Cookies.get("token");
console.log("Token:", token);
if (token) {
    const decoded = jwt_decode(token);
    console.log("Decoded Token:", decoded);
}
*/


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

// Employer Register Endpoint
app.post('/employerRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'businessPermit', maxCount: 1 },
    { name: 'id', maxCount: 1 },
    { name: 'businessImage', maxCount: 1}
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
          streetAddress
        })
        .then(user => res.json("Success"))
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
  

  

// Applicant Register Endpoint
app.post('/applicantRegister', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'cor', maxCount: 1 },
    { name: 'schoolId', maxCount: 1 }
]), (req, res) => {
    const { firstName, lastName, email, password, streetAddress } = req.body;
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
                streetAddress
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
    const { firstName, lastName, email, password, campusAddress, contactNumber, houseNumber } = req.body;
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
                campusAddress,
                contactNumber,
                houseNumber
            })
            .then(user => res.json("Success"))
            .catch(err => res.status(400).json(err));
        }).catch(err => res.status(500).json(err));
});

app.listen(5000, () => {
    console.log("server is running");
    
});