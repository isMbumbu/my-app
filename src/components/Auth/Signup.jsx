import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const bgImage = "/sven-mieke-MsCgmHuirDo-unsplash.jpg";

export function Button({ children, ...props }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-xl" {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`rounded-2xl shadow-lg p-4 bg-white ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function Input({ type = "text", ...props }) {
  return <input type={type} className="border rounded-lg px-3 py-2 w-full" {...props} />;
}

export function Label({ children }) {
  return <label className="block text-gray-400 mb-2">{children}</label>;
}

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://simple-gymbuddy.onrender.com/sign-up", formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        alert(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4"style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", height: "100vh" }}>
      <Card className="w-full max-w-lg">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="role_id">Role (optional)</Label>
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="">Select a role</option>
                <option value="1">User</option>
                <option value="2">Trainer</option>
                <option value="3">Admin</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
