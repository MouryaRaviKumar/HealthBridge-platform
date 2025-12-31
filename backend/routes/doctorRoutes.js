const express = require('express');
const router = express.Router();
const { getAllAppointments, getAppointmentDetails, getPatientHistory , createMedicalRecords } = require("../Controller/doctorController");

//// Define patient-related routes here

// Route to get all appointments of a particular doctor
router.get('/appointments', getAllAppointments);

// Route to get details of a particular appointment
router.get('/appointments/:appointmentId', getAppointmentDetails);

// Route to get medical history of a particular patient
router.get('/patients/:patientId/history', getPatientHistory);

// Route to create medical Records of the patient
router.post("/:appointmentId/medical-records", createMedicalRecords);

module.exports = router;