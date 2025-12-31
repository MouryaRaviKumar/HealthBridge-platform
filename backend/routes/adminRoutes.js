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

// Admin Routes

// Get all doctors
router.get("/doctors", getAllDoctors);

// Get all pending doctors
router.get("/doctors/pending", getPendingDoctors);

// Approve a doctor
router.put("/doctors/:doctorId/approve", approveDoctor);

// Update doctor status
router.put("/doctor/:doctorId/status", updateDoctorStatus);

// Get all patients
router.get("/patients", getAllPatients);

// Get patient details
router.get("/patients/:patientId", getPatientDetails);

// Get patient history
router.get("/patients/:patientId/history", getPatientHistory);

// Get patients of a particular doctor
router.get("/doctors/:doctorId/patients", getPatientsOfDoctor);
    

module.exports = router;