import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Typography, Input, Select, Button, Alert, Spin, Form } from 'antd';
import { Option } from 'antd/es/mentions'; // For Select's Option component

interface StudentFormData {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  course: string;
}

interface Department {
  name: string;
  courses: string[];
}

const AdvancedRegistration: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentFormData>({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    department: '',
    course: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);

  // Hook: Check screen size for responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch departments and courses from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/course/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        // Fallback to dummy data if fetch fails
        setDepartments([
          { name: 'Computer Science', courses: ['Software Engineering', 'Cybersecurity', 'AI & ML'] },
          { name: 'Business', courses: ['Accounting', 'Marketing', 'Finance'] },
          { name: 'Engineering', courses: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering'] },
        ]);
      }
    };
    fetchDepartments();
  }, []);

  // Handle form input changes for Input components
  const handleChange = (value: string, name: string) => {
    setStudentData({ ...studentData, [name]: value });
  };

  // Handle department selection change for Select components
  const handleDepartmentChange = (value: string) => {
    const selectedCourses = departments.find(dep => dep.name === value)?.courses || [];
    setStudentData({
      ...studentData,
      department: value,
      course: selectedCourses[0] || '', // Default to the first course if available
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload = { role: 'student', ...studentData };
      await axios.post('http://localhost:3000/auth/register', payload);
      setSuccess('Registration successful!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Branding Section - Only shown on large screens */}
      {isLargeScreen && (
        <div
          style={{
            flex: 1,
            background: 'linear-gradient(to right, #3f51b5, #9c27b0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Typography.Title level={2} style={{ color: 'white' }}>
              internAtlas
            </Typography.Title>
            <Typography.Text style={{ color: 'white' }}>
              Track your internship journey with precision and care.
            </Typography.Text>
          </div>
        </div>
      )}

      {/* Registration Form Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <Card style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
          <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Student Registration
          </Typography.Title>

          <Form onSubmitCapture={handleSubmit} layout="vertical">
            <Form.Item label="Student Name" required>
              <Input
                name="name"
                value={studentData.name}
                onChange={(e) => handleChange(e.target.value, 'name')}
                required
              />
            </Form.Item>

            <Form.Item label="Student ID" required>
              <Input
                name="studentId"
                value={studentData.studentId}
                onChange={(e) => handleChange(e.target.value, 'studentId')}
                required
              />
            </Form.Item>

            <Form.Item label="Email" required>
              <Input
                name="email"
                type="email"
                value={studentData.email}
                onChange={(e) => handleChange(e.target.value, 'email')}
                required
              />
            </Form.Item>

            <Form.Item label="Phone Number" required>
              <Input
                name="phone"
                value={studentData.phone}
                onChange={(e) => handleChange(e.target.value, 'phone')}
                required
              />
            </Form.Item>

            {/* Department Dropdown */}
            <Form.Item label="Department" required>
              <Select
                value={studentData.department}
                onChange={handleDepartmentChange}
              >
                <Option value="" disabled>
                  Select a department
                </Option>
                {departments.map((dept) => (
                  <Option key={dept.name} value={dept.name}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Course Dropdown */}
            <Form.Item label="Course" required>
              <Select
                value={studentData.course}
                onChange={(value) => handleChange(value, 'course')}
              >
                <Option value="" disabled>
                  Select a course
                </Option>
                {departments
                  .find(dep => dep.name === studentData.department)
                  ?.courses.map((course) => (
                    <Option key={course} value={course}>
                      {course}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            {error && (
              <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />
            )}
            {success && (
              <Alert message={success} type="success" showIcon style={{ marginBottom: '16px' }} />
            )}

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={loading}
              style={{ marginTop: '16px' }}
            >
              {loading ? <Spin /> : 'Register'}
            </Button>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography.Text>
              Already have an account?{' '}
              <Link to="/" style={{ color: '#1890ff' }}>
                Login here
              </Link>
            </Typography.Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedRegistration;
