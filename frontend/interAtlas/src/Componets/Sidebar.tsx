import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Globalcontext";
import {
    FaHome,
    FaUser,
    FaFileAlt,
    FaChalkboardTeacher,
    FaClipboardCheck,
    FaSignOutAlt
} from "react-icons/fa";

const Sidebar: React.FC = () => {
    const { sidebarOpen, toggleSidebar } = useGlobalContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication tokens (adjust as per your auth method)
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');

        // Redirect to login page
        navigate('/login');
    };

    return (
        <aside
            className={`bg-gray-50 text-gray-800 h-screen fixed top-0 left-0 transition-all duration-300 flex flex-col z-50 shadow-xl
            ${sidebarOpen ? "w-64" : "hidden w-20"} sm:relative sm:flex`}
        >
            {/* Sidebar Header */}
            <div className={`${sidebarOpen ? "flex" : "hidden"} sm:flex items-center justify-between p-4 border-b border-gray-700`}>
                <span className="text-xl font-bold">{sidebarOpen ? "InternAtlas" : "IA"}</span>
                <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 transition">
                    ☰
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex-1">
                <ul className="space-y-2">
                    <SidebarItem to="/dashboard/home" icon={<FaHome />} text="Dashboard" sidebarOpen={sidebarOpen} />
                    <SidebarItem to="/dashboard/profile" icon={<FaUser />} text="Profile" sidebarOpen={sidebarOpen} />
                    <SidebarItem to="/dashboard/documents" icon={<FaFileAlt />} text="Documents" sidebarOpen={sidebarOpen} />
                    <SidebarItem to="/dashboard/teachers" icon={<FaChalkboardTeacher />} text="Teachers" sidebarOpen={sidebarOpen} />
                    <SidebarItem to="/dashboard/assessments" icon={<FaClipboardCheck />} text="Assessments" sidebarOpen={sidebarOpen} />
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full max-w-lg bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                    <FaSignOutAlt className="text-lg" />
                    {sidebarOpen && <span className="text-sm">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

// Sidebar Item Component
const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; text: string; sidebarOpen: boolean }> = ({ to, icon, text, sidebarOpen }) => {
    return (
        <li>
            <Link
                to={to}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-100 transition max-w-lg"
            >
                <span className="text-lg">{icon}</span>
                {sidebarOpen && <span className="text-sm">{text}</span>}
            </Link>
        </li>
    );
};

export default Sidebar;
