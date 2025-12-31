const asyncHandler = require('express-async-handler');
const Appointment = require('../Models/appointmentModel');


//Description:  Create a new appointment
//Route:        POST /patient/appointments
//Access:       Public
const createAppointment = asyncHandler(async (req, res) => {
    const { doctor, appointmentDate, timeSlot } = req.body;
    if (!doctor || !appointmentDate || !timeSlot) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }
    const appointment = await Appointment.create({
        patient: req.user.id,
        doctor,
        appointmentDate,
        timeSlot
    });
    res.status(201).json(appointment);
});

//Description:  Get all appointments for the logged-in patient
//Route:        GET /patient/appointments/my
//Access:       Private 
const getMyAppointments = asyncHandler(async (req, res) => {
    // Logic for fetching patient's appointments would go here
    res.status(200).json({ msg: "List of my appointments" });
});

//Description:  Get medical records for the logged-in patient
//Route:        GET /patient/medical-records/my
//Access:       Private 
const getMyMedicalRecords = asyncHandler(async (req, res) => {
    // Logic for fetching patient's medical records would go here
    res.status(200).json({ msg: "My medical records" });
});

module.exports = {
    createAppointment,
    getMyAppointments,
    getMyMedicalRecords
};  
