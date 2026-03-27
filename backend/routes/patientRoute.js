const express = require("express");
const router = express.Router();
const { createAppointment, getMyAppointments, getMyMedicalRecords, getApprovedDoctors } = require("../Controller/patientController");
const { protect } = require("../middleware/authMiddleware");
const { patientOnly } = require("../middleware/patientMiddleware");
const { attachProfile } = require("../middleware/profileMiddleware");

// Define patient-related routes here

// Route to create an appointment
router.post("/appointments", protect, attachProfile, patientOnly, createAppointment);

// Route to get patient's appointments
router.get("/appointments/my", protect, attachProfile, patientOnly, getMyAppointments);

// Route to get patient's medical records
router.get("/medical-records/my", protect, attachProfile, patientOnly, getMyMedicalRecords);

// Route to get list of approved doctors for selection
router.get("/doctors", protect, attachProfile, patientOnly, getApprovedDoctors);

module.exports = router;