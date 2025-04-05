const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['student']},
  name: { type: String, required: true, minlength: 3,maxlength: 50},
  studentId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true , match: /^\+?[0-9]{7,15}$/ },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
