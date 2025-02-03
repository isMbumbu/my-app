import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import './login.css'

const logIn = async ({ email, password }) => {
  try {
    const response = await axios.post("https://simple-gymbuddy.onrender.com/login", {
      email,
      password,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export function Button({ children, ...props }) {
  return (
    <button
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-300"
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}

export function Label({ children }) {
  return (
    <label className="block text-gray-700 font-semibold mb-2">{children}</label>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await logIn({ email, password });

        console.log("Login Response:", response); // Log the full response for debugging

        if (response.data && response.data.access_token) {
            alert(response.data.message || "Login successful!");

            // Store necessary data in localStorage
            localStorage.setItem("email", email);
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("role", response.data.role || "user");

            // Ensure member_id is always set
            if (response.data.member_id) {
                localStorage.setItem("member_id", response.data.member_id);
            } else {
                localStorage.removeItem("member_id"); // Clear if not a member
            }

            // Set trainer_id if available
            if (response.data.trainer_id) {
                localStorage.setItem("trainer_id", response.data.trainer_id);
            } else {
                localStorage.removeItem("trainer_id"); // Clear if not a trainer
            }

            // Set admin_id if available
            if (response.data.admin_id) {
                localStorage.setItem("admin_id", response.data.admin_id);
            } else {
                localStorage.removeItem("admin_id"); // Clear if not an admin
            }

            // Navigate to the dashboard
            navigate("/dashboard");
        } else {
            alert("Unexpected response structure.");
        }
    } catch (err) {
        console.error("Login Error:", err); // Log the error for debugging
        if (err.response && err.response.data) {
            alert(err.response.data.message || "Invalid credentials. Please try again.");
        } else {
            alert("An error occurred. Please try again later.");
        }
    }
};
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-8">
            Please enter your credentials to continue.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-center">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </CardContent>
        <div className="mt-6 text-center text-gray-500 text-sm">
          © 2025 GymBuddy App. All rights reserved.
        </div>
      </Card>
    </div>
  );
}

export default Login;