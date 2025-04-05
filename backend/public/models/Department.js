const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  courses: { type: [String], required: true } // List of course names
});

module.exports = mongoose.model('Department', DepartmentSchema);
