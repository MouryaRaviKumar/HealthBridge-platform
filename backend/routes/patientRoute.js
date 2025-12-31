const express = require("express");
const router = express.Router();
const { createAppointment, getMyAppointments, getMyMedicalRecords } = require("../Controller/patientController");

// Define patient-related routes here

// Route to create an appointment
router.post("/appointments", createAppointment);

// Route to get patient's appointments
router.get("/appointments/my", getMyAppointments);

// Route to get patient's medical records
router.get("/medical-records/my", getMyMedicalRecords);


module.exports = router;