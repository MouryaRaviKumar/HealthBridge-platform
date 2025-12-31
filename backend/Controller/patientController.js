const asyncHandler = require('express-async-handler');
const Appointment = require('../Models/appointmentModel');
const MedicalRecord = require('../Models/medicalRecordModel');
const Doctor = require('../Models/doctorModel');

//Description:  Create a new appointment
//Route:        POST /patient/appointments
//Access:       Private
const createAppointment = asyncHandler(async (req, res) => {
    const { doctor, appointmentDate, timeSlot } = req.body;
    //Check if all required fields are provided
    if (!doctor || !appointmentDate || !timeSlot) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }
    //Check if the logged-in user is a patient
    if (req.user.role !== 'PATIENT') {
        res.status(403);
        throw new Error('Only patients can create appointments');
    }
    //Check if the doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
        res.status(404);
        throw new Error('Doctor not found');
    }
    //Check if the appointment date is valid and in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);
    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
        res.status(400);
        throw new Error('Invalid appointment date');
    }

    //Check if the time slot is already booked for the selected doctor and date
    const existingAppointment = await Appointment.findOne({
        doctor,
        appointmentDate : selectedDate,
        timeSlot,
        status: { $ne: 'CANCELLED' }
    });
    if (existingAppointment) {
        res.status(409);
        throw new Error('This time slot is already booked');
    }
    //Create the appointment
    const appointment = await Appointment.create({
        patient: req.user.id,
        doctor,
        appointmentDate : selectedDate,
        timeSlot
    });
    //Return the created appointment
    res.status(201).json(appointment);
});

//Description:  Get all appointments for the logged-in patient
//Route:        GET /patient/appointments/my
//Access:       Private 
const getMyAppointments = asyncHandler(async (req, res) => {
    //Fetch appointments for the logged-in patient
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name specialization');
    //Return the appointments
    res.status(200).json(appointments);
});

//Description:  Get medical records for the logged-in patient
//Route:        GET /patient/medical-records/my
//Access:       Private 
const getMyMedicalRecords = asyncHandler(async (req, res) => {
    //Fetch medical records for the logged-in patient
    const records = await MedicalRecord
    .find({ patient: req.user.id })
    .populate('doctor', 'name specialization')
    .sort({ createdAt: -1 });

    //Return the medical records
    res.status(200).json(records);
});

module.exports = {
    createAppointment,
    getMyAppointments,
    getMyMedicalRecords
};  
