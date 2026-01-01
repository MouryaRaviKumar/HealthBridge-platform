const express = require("express");
const router = express.Router();
const { createAppointment, getMyAppointments, getMyMedicalRecords } = require("../Controller/patientController");
const { protect } = require("../middleware/authMiddleware");
const { patientOnly } = require("../middleware/patientMiddleware");

// Define patient-related routes here

// Route to create an appointment
router.post("/appointments", protect, patientOnly, createAppointment);

// Route to get patient's appointments
router.get("/appointments/my", protect, patientOnly, getMyAppointments);

// Route to get patient's medical records
router.get("/medical-records/my", protect, patientOnly, getMyMedicalRecords);

module.exports = router;