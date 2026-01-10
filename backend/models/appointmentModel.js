const mongoose = require('mongoose');

const TIME_SLOTS = [
  '09:00-09:30',
  '09:30-10:00',
  '10:00-10:30',
  '10:30-11:00',
  '11:00-11:30',
  '11:30-12:00',
  '14:00-14:30',
  '14:30-15:00',
  '15:00-15:30',
  '15:30-16:00'
];

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    enum: TIME_SLOTS,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, { timestamps: true });

appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.Appointment ||
  mongoose.model('Appointment', appointmentSchema);