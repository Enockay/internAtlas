import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Main/Login";
import Signup from "./Main/Signup";
import Dashboard from "./Componets/Dashboard";
import Profile from "./Pages/Profile";
import Documents from "./Pages/Documents";
import Teachers from "./Pages/Lecture";
import Assessments from "./Pages/Assessment";
import DashboardHome from "./Pages/Home"; // Default dashboard content
import { GlobalProvider } from "./context/Globalcontext";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard with Nested Routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="documents" element={<Documents />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="assessments" element={<Assessments />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
