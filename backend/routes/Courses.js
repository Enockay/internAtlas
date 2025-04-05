const express = require('express');
const Department = require('../public/models/Department');
const Course = require('../public/models/Course');

const router = express.Router();

// Add Department
router.post('/departments', async (req, res) => {
  try {
    const { name, courses } = req.body;
    const department = new Department({ name, courses });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Course
router.post('/courses', async (req, res) => {
  try {
    const { name, departmentId } = req.body;
    const department = await Department.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const course = new Course({ name, department: departmentId });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
