import React, { useEffect, useState} from "react";
import { FaUpload, FaFileAlt, FaTrash } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import {useGlobalContext } from "../context/Globalcontext"; // Ensure you have the User Context

interface UploadedLog {
  _id: string;
  date: string;
  fileName: string;
  fileUrl: string;
}

const Documents: React.FC = () => {
  const { user } = useGlobalContext(); // Get user from global context
  const [selectedDate, setSelectedDate] = useState("");
  const [logFile, setLogFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<UploadedLog[]>([]);
  const [error, setError] = useState("");
  const [finalDate, setFinalDate] = useState(""); // Final logbook submission date
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  // Fetch logs for the logged-in student
  const fetchLogs = async () => {
    setFetching(true);
    try {
      const response = await fetch(`http://localhost:3000/api/logs/${user?._id}`);
      const data = await response.json();
      setLogs(data.logs);
      setFinalDate(data.finalSubmissionDate); // Fetch final submission date
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setFetching(false);
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogFile(e.target.files[0]);
    }
  };

  // Handle Log Upload
  const handleUpload = async () => {
    if (!selectedDate || !logFile) {
      setError("Please select a date and upload a log file.");
      return;
    }

    if (logs.some((log) => log.date === selectedDate)) {
      setError("A log has already been uploaded for this date.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("userId", user?._id ?? "");
    formData.append("date", selectedDate);
    formData.append("logFile", logFile);

    try {
      const response = await fetch("/api/logs/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchLogs(); // Refresh logs
        setLogFile(null);
        setSelectedDate("");
      } else {
        setError("Failed to upload log file. Try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Log Deletion
  const handleDelete = async (logId: string) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    try {
      const response = await fetch(`/api/logs/delete/${logId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLogs((prevLogs) => prevLogs.filter((log) => log._id !== logId));
      } else {
        setError("Failed to delete log.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!user) {
    return <p className="text-red-500 text-center mt-6">You must be logged in to access this page.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Attachment Logbook</h2>

      {/* Date Picker & File Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Select Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Upload Daily Log</label>
        <input type="file" className="w-full p-2 border rounded" onChange={handleFileChange} />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-blue-600 transition disabled:opacity-50"
        disabled={loading}
      >
        <FaUpload />
        {loading ? <ClipLoader size={15} color={"#fff"} /> : "Upload Log"}
      </button>

      {/* Final Submission Date */}
      {finalDate && (
        <p className="text-gray-600 mt-4">
          <span className="font-bold">Final Log Submission Date:</span> {finalDate}
        </p>
      )}

      {/* Uploaded Logs Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Logs</h3>

        {fetching ? (
          <div className="flex justify-center">
            <ClipLoader size={25} color={"#000"} />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No logs uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li key={log._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-gray-700 font-semibold">{log.fileName}</p>
                    <p className="text-gray-500 text-sm">Uploaded on: {log.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(log._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Documents;
