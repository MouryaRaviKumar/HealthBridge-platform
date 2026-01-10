const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Cardiology',
            'Neurology',
            'Orthopedics',
            'Pediatrics',
            'Dermatology',
            'Gynecology',
            'Oncology',
            'ENT',
            'Psychiatry',
            'General Medicine'
        ]
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    contactInfo: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['approval pending', 'working', 'not working', 'suspended'],
        default: 'approval pending'
    }
}, {
    timestamps: true
});

module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);