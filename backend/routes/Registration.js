const express = require('express');
const Joi = require('joi');
const Student = require('../public/models/Student'); // Adjust the path as needed
const Department = require('../public/models/Department');
const Course = require('../public/models/Course');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const router = express.Router();

// Define the validation schema for registration
const registrationSchema = Joi.object({
  role: Joi.string().valid('student').required(),
  name: Joi.string().min(3).max(50).required(),
  studentId: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required(),
  department: Joi.string().required(),
  course: Joi.string().required(),
});

// POST /api/register endpoint
router.post('/register', async (req, res) => {
  const { error, value } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, studentId, department, course } = value;

    // Check if department exists
    const existingDepartment = await Department.findOne({ name: department });
    if (!existingDepartment) {
      return res.status(400).json({ message: 'Selected department does not exist in our systems yet' });
    }

    // Check if the course belongs to the department
    const existingCourse = await Course.findOne({ name: course, department: existingDepartment._id });
    if (!existingCourse) {
      return res.status(400).json({ message: 'Selected course does not exist in the chosen department' });
    }

    // Check if a student with the same email or studentId already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already registered' });
    }

    // Create and save new student
    const newStudent = new Student({ ...value, department: existingDepartment._id, course: existingCourse._id });
    await newStudent.save();

    return res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
    const { studentId, email } = req.body;
  
    try {
      // Find user by studentId and email
      const user = await Student.findOne({ studentId, email });
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid student ID or email' });
      }
  
      // Optionally, if you want to compare password (if you have one)
      // const validPassword = await bcrypt.compare(req.body.password, user.password);
      // if (!validPassword) return res.status(400).json({ message: 'Invalid password' });
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
