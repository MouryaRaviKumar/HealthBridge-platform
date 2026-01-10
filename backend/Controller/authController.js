const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Description  : Register a new patient
//Route        : POST /auth/register-patient
//Access       : Public
const registerPatient = asyncHandler(async (req, res) => {
    const { name , age , gender , bloodgroup , contactNumber , email , password } = req.body;
    if(!name || age === undefined || !gender || !bloodgroup || !contactNumber || !email || !password){
        res.status(400)
        throw new Error("Please fill all the fields");
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const normalizedEmail = email.toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail }).session(session);
        if(userExists){
            res.status(409)
            throw new Error("User already exists");
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await User.create([{
            name , 
            email: normalizedEmail ,
            password : hashedPassword,
            role : 'PATIENT'
        }],{session});

        const [newPatient] = await Patient.create([{
            user : newUser._id,
            name,
            age,
            gender,
            bloodgroup,
            contactNumber,
        }],{session});

        await session.commitTransaction();

        res.status(201).json({
            id : newPatient._id,
            userId : newUser._id,
            name,
            age,
            gender,
            bloodgroup,
            contactNumber,
            token : generateToken(newUser),
        })
    }catch(err){
        await session.abortTransaction();
        throw err;
    }finally{
        session.endSession()
    }
});

//Description  : Register a new doctor
//Route        : POST /auth/register-doctor
//Access       : Public
const registerDoctor = asyncHandler(async (req, res) => {
    const { name , department , experience , contactInfo , email , password } = req.body;
    
    if(!name || !department || experience === undefined || !contactInfo || !email || !password ){
        res.status(400)
        throw new Error("Please fill all the fields");
    }

    if (isNaN(experience) || experience < 0) {
        res.status(400);
        throw new Error("Experience must be a valid number");
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const normalizedEmail = email.toLowerCase();
        const userExists = await User.findOne({ email : normalizedEmail }).session(session);
        if(userExists){
            res.status(409)
            throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [newUser] = await User.create([{
            name,
            email : normalizedEmail,
            password : hashedPassword,
            role : 'DOCTOR'
        }], {session});

        const [newDoctor] = await Doctor.create([{
            user : newUser._id,
            name,
            department,
            experience,
            contactInfo,   
        }], {session});
        await session.commitTransaction();
        res.status(201).json({
            id : newDoctor._id,
            user : newUser._id,
            name,
            department,
            experience,
            contactInfo,
            token : generateToken(newUser)
        });
    }catch(err){
        await session.abortTransaction();
        throw err;
    }finally{
        session.endSession()
    }
});

//Description  : Login user (patient or doctor)
//Route        : POST /auth/login
//Access       : Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("Please fill all the fields");
    }
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email : normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token : generateToken(user),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// Description  : Register ADMIN user
// Route        : POST /auth/admin-register
// Access       : Public
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const normalizedEmail = email.toLowerCase();
        // Check if user already exists
        const userExists = await User.findOne({ email : normalizedEmail }).session(session);
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create ADMIN user
        const [newUser] = await User.create([{
            name,
            email : normalizedEmail,
            password: hashedPassword,      // assume password hashing in pre-save hook
            role: 'ADMIN', // force ADMIN role
        }], {session});
        await session.commitTransaction();
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token : generateToken(newUser),
        });
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

//Description  : Login ADMIN user
//Route        : POST /auth/admin-login
//Access       : Public
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("Please fill all the fields");
    }
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email : normalizedEmail });

    if (user && user.role === 'ADMIN' && (await bcrypt.compare(password, user.password))) { 
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token : generateToken(user),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

module.exports = {
    registerPatient,
    registerDoctor,
    loginUser,
    registerAdmin,
    loginAdmin
};

//Generate a JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};