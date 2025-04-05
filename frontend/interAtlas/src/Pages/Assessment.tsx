import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaStar, FaInfoCircle } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { useGlobalContext } from "../context/Globalcontext";

interface Assessment {
  _id: string;
  studentId: string;
  date: string;
  status: "Upcoming" | "Completed" | "Rescheduled";
  feedback: string;
  rating: number;
  finalReportStatus: "Pending" | "Approved" | "Rejected";
}

const StudentAssessment: React.FC = () => {
  const { user } = useGlobalContext();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchAssessmentData();
    }
  }, [user]);

  // Fetch assessment data for the logged-in student
  const fetchAssessmentData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:3000/api/students/${user?._id}/assessment`);
      if (!response.ok) throw new Error("Failed to fetch assessment data");

      const data = await response.json();
      setAssessment(data);
    } catch (err:any) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reassessment Request
  const requestReassessment = async () => {
    try {
      setSubmitting(true);
      setSubmissionError("");

      const response = await fetch(`http://localhost:3000/api/students/${user?._id}/assessment/reassess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Student requested reassessment" }),
      });

      if (!response.ok) throw new Error("Failed to request reassessment");

      fetchAssessmentData(); // Refresh assessment data
    } catch (err:any) {
      setSubmissionError(err.message || "Failed to submit reassessment request");
    } finally {
      setSubmitting(false);
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

  if (!assessment) {
    return <p className="text-gray-500 text-center mt-6">No assessment data available.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">My Assessment</h2>

      {/* Assessment Schedule */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <FaCalendarAlt className="text-blue-500 mr-2" /> Assessment Date
        </h3>
        <p className="text-gray-600">{assessment.date} ({assessment.status})</p>
      </div>

      {/* Performance Rating */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <FaStar className="text-yellow-500 mr-2" /> Performance Rating
        </h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= assessment.rating ? "text-yellow-500" : "text-gray-300"}
            />
          ))}
        </div>
      </div>

      {/* Lecturer Feedback */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <FaInfoCircle className="text-green-500 mr-2" /> Lecturer Feedback
        </h3>
        <p className="text-gray-600">{assessment.feedback || "No feedback provided yet."}</p>
      </div>

      {/* Final Report Status */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <FaInfoCircle className="text-blue-500 mr-2" /> Final Report Status
        </h3>
        <p className={`text-sm font-semibold ${assessment.finalReportStatus === "Approved" ? "text-green-500" : assessment.finalReportStatus === "Rejected" ? "text-red-500" : "text-gray-600"}`}>
          {assessment.finalReportStatus}
        </p>
      </div>

      {/* Error message for reassessment submission */}
      {submissionError && <p className="text-red-500 text-sm mb-4">{submissionError}</p>}

      {/* Reassessment Button */}
      {assessment.finalReportStatus === "Rejected" && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center justify-center"
          onClick={requestReassessment}
          disabled={submitting}
        >
          {submitting ? <ClipLoader size={15} color={"#fff"} /> : "Request Reassessment"}
        </button>
      )}
    </div>
  );
};

export default StudentAssessment;
