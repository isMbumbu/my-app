import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import ClassScheduling from "./pages/ClassScheduling";
import ProgressTracker from "./pages/ProgressTracker";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import CreateWorkoutPlan from "./pages/CreateWorkoutPlan";
import MemberList from "./pages/MemberList";
import Classes from "./pages/Classes";
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light text-dark">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              GymBuddy
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {["/", "/dashboard", "/class-schedule", "/register", "/login"].map((path, index) => (
                  <li className="nav-item" key={index}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      {path === "/" ? "Home" : path.replace("/", "").replace("-", " ")}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content with Background Color */}
        <div style={styles.contentContainer}>
          <main className="container my-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/class-schedule" element={<ClassScheduling />} />
              <Route path="/progress-tracker" element={<ProgressTracker />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/createWorkout" element={<CreateWorkoutPlan />} />
              <Route path="/MemberList" element={<MemberList />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/progress" element={<ProgressTracker />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-primary text-white text-center py-4">
          <p className="mb-0">&copy; 2025 GymBuddy App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

const styles = {
  contentContainer: {
    backgroundColor: '#f8f9fa', // Light background color for the content area
    minHeight: 'calc(100vh - 140px)', // Adjust for navbar and footer height
    paddingTop: '20px',
  },
};

export default App;
