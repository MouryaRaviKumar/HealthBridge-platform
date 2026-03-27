const express = require('express');
const router = express.Router();
const { getAllAppointments, getAppointmentDetails, getPatientHistory , createMedicalRecords } = require("../Controller/doctorController");
const { protect } = require("../middleware/authMiddleware");
const { doctorOnly } = require("../middleware/DoctorMiddleware");
const { attachProfile } = require("../middleware/profileMiddleware");
//// Define patient-related routes here

// Route to get all appointments of a particular doctor
router.get('/appointments', protect, attachProfile, doctorOnly, getAllAppointments);

// Route to get details of a particular appointment
router.get('/appointments/:appointmentId', protect, attachProfile, doctorOnly, getAppointmentDetails);

// Route to get medical history of a particular patient
router.get('/patients/:patientId/history', protect, attachProfile, doctorOnly, getPatientHistory);

// Route to create medical Records of the patient
router.post("/:appointmentId/medical-records", protect, attachProfile, doctorOnly, createMedicalRecords);

module.exports = router;