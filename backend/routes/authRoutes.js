const express = require('express');
const router = express.Router();
const { registerPatient, registerDoctor, loginUser , registerUser , loginAdmin } = require('../Controller/authController');

// Define routes and link them to controller functions

//Route: POST /auth/register-patient
router.post('/register-patient', registerPatient);

//Route: POST /auth/register-doctor
router.post('/register-doctor', registerDoctor); 

//Route: POST /auth/login
router.post('/login', loginUser);

//Route: POST /auth/register
router.post('/register', registerUser);

//Route : POST /auth/admin-login
router.post('/admin-login', loginAdmin);

module.exports = router;