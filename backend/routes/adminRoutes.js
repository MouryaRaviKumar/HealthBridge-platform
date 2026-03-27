const express = require("express");
const router = express.Router();
const { getAllDoctors,
        getPendingDoctors,
        approveDoctor, 
        updateDoctorStatus, 
        getAllPatients, 
        getPatientDetails, 
        getPatientHistory, 
        getPatientsOfDoctor 
    } = require("../Controller/adminController");
const { adminOnly } = require("../middleware/adminOnlyMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { paginationMiddleware } = require("../middleware/paginationMiddleware");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");

// Admin Routes

// Get all doctors
router.get("/doctors", protect, adminOnly, paginationMiddleware(Doctor), getAllDoctors);

// Get all pending doctors
router.get("/doctors/pending", protect, adminOnly, getPendingDoctors);

// Approve a doctor
router.put("/doctors/:doctorId/approve", protect, adminOnly, approveDoctor);

// Update doctor status
router.put("/doctor/:doctorId/status", protect, adminOnly, updateDoctorStatus);

// Get all patients
router.get("/patients", protect, adminOnly, paginationMiddleware(Patient), getAllPatients);


// Get patient details
router.get("/patients/:patientId", protect, adminOnly, getPatientDetails);

// Get patient history
router.get("/patients/:patientId/history", protect, adminOnly, getPatientHistory);

// Get patients of a particular doctor
router.get("/doctors/:doctorId/patients", protect, adminOnly, getPatientsOfDoctor);
    

module.exports = router;