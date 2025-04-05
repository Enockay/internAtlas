import React from "react";
import { FaUserGraduate, FaFileAlt, FaChalkboardTeacher } from "react-icons/fa";

const DashboardHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <h2 className="md:text-3xltext-2xl  font-extrabold text-gray-800">
              Welcome to InternAtlas
            </h2>
            <span className="text-sm text-gray-500">
              Your internship dashboard
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Manage your internship experience with ease. Update your details, upload important documents, connect with your teachers, and keep track of your assessments—all in one place.
          </p>

          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Profile Progress Card */}
            <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-xl transition duration-300">
              <div className="flex items-center space-x-4">
                <FaUserGraduate className="text-blue-600 text-4xl" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Profile Progress
                </h3>
              </div>
              <p className="mt-4 text-gray-700 text-base">
                Keep your profile updated to maximize your internship opportunities and professional growth.
              </p>
            </div>

            {/* Document Upload Card */}
            <div className="bg-green-50 p-6 rounded-lg shadow hover:shadow-xl transition duration-300">
              <div className="flex items-center space-x-4">
                <FaFileAlt className="text-green-600 text-4xl" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Document Uploads
                </h3>
              </div>
              <p className="mt-4 text-gray-700 text-base">
                Securely upload and manage your documents to ensure a smooth verification process.
              </p>
            </div>

            {/* Teacher Assessments Card */}
            <div className="bg-yellow-50 p-6 rounded-lg shadow hover:shadow-xl transition duration-300">
              <div className="flex items-center space-x-4">
                <FaChalkboardTeacher className="text-yellow-600 text-4xl" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Teacher Assessments
                </h3>
              </div>
              <p className="mt-4 text-gray-700 text-base">
                Access assessments and feedback from your teachers to continually improve your skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
