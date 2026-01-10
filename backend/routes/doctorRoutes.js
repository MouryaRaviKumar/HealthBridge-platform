const express = require('express');
const router = express.Router();
const { getAllAppointments, getAppointmentDetails, getPatientHistory , createMedicalRecords } = require("../Controller/doctorController");
const { protect } = require("../middleware/authMiddleware");
const { doctorOnly } = require("../middleware/DoctorMiddleware");
//// Define patient-related routes here

// Route to get all appointments of a particular doctor
router.get('/appointments', protect, doctorOnly, getAllAppointments);

// Route to get details of a particular appointment
router.get('/appointments/:appointmentId', protect, doctorOnly, getAppointmentDetails);

// Route to get medical history of a particular patient
router.get('/patients/:patientId/history', protect, doctorOnly, getPatientHistory);

// Route to create medical Records of the patient
router.post("/:appointmentId/medical-records", protect, doctorOnly, createMedicalRecords);

module.exports = router;