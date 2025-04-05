import React, { useEffect, useState } from "react";
import {FaCalendarAlt} from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { useGlobalContext } from "../context/Globalcontext";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  attachmentSite: {
    companyName: string;
    supervisorName: string;
    supervisorContact: string;
    startDate: string;
    endDate: string;
  };
}

interface Assessment {
  _id: string;
  studentId: string;
  date: string;
  status: "Upcoming" | "Completed" | "Rescheduled";
  feedback: string;
}

const LecturerDashboard: React.FC = () => {
  const { user } = useGlobalContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchLecturerData();
    }
  }, [user]);

  // Fetch students & assessment schedules assigned to the lecturer
  const fetchLecturerData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:3000/api/lecturers/${user?._id}/students`);
      if (!response.ok) throw new Error("Failed to fetch students data");

      const data = await response.json();
      setStudents(data.students);
      setAssessments(data.assessments);
    } catch (err:any) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Handle feedback submission
  const submitFeedback = async (assessmentId: string, feedback: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/assessments/${assessmentId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      // Update local state with the new feedback
      setAssessments((prev) =>
        prev.map((assessment) =>
          assessment._id === assessmentId ? { ...assessment, feedback } : assessment
        )
      );
    } catch (err:any) {
      alert(err.message || "Error submitting feedback");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <ClipLoader size={30} color={"#4A90E2"} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Lecturer Dashboard</h2>

      {/* Assigned Students Section */}
      <h3 className="text-lg font-semibold text-gray-800 mt-4">Assigned Students</h3>
      {students.length === 0 ? (
        <p className="text-gray-500">No students assigned yet.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li key={student._id} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-gray-800 font-semibold">{student.name} (ID: {student.studentId})</h4>
              <p className="text-gray-600">{student.email} | {student.phone}</p>
              <p className="text-sm text-gray-500">
                Internship: {student.attachmentSite.companyName} (Supervisor: {student.attachmentSite.supervisorName})
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Assessment Schedule */}
      <h3 className="text-lg font-semibold text-gray-800 mt-6">Assessment Schedule</h3>
      {assessments.length === 0 ? (
        <p className="text-gray-500">No assessments scheduled yet.</p>
      ) : (
        <ul className="space-y-3">
          {assessments.map((assessment) => (
            <li key={assessment._id} className="bg-gray-100 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-yellow-500 text-xl" />
                  <div>
                    <p className="text-gray-700 font-semibold">{assessment.date}</p>
                    <p
                      className={`text-sm ${
                        assessment.status === "Completed"
                          ? "text-green-500"
                          : assessment.status === "Rescheduled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {assessment.status}
                    </p>
                  </div>
                </div>
              </div>
              {/* Feedback Form */}
              <textarea
                placeholder="Provide feedback..."
                className="mt-3 w-full border rounded p-2"
                defaultValue={assessment.feedback}
                onBlur={(e) => submitFeedback(assessment._id, e.target.value)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LecturerDashboard;
