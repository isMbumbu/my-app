import React, { useState } from "react";
import axios from "axios";

const CreateWorkoutPlan = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging: Log the token

    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    const trainerId = localStorage.getItem("trainer_id");
    console.log("Trainer ID:", trainerId); // Debugging: Log the trainer ID

    const planData = {
      name: name,
      description: description,
      trainer_id: trainerId,
    };
    console.log("Request Payload:", planData); // Debugging: Log the payload

    try {
      const response = await axios.post(
        "https://simple-gymbuddy.onrender.com/workout-plan",
        planData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success
      setSuccessMessage(response.data.message);
      console.log("Workout plan created:", response.data);
      setName("");
      setDescription("");
      setError(null);
    } catch (error) {
      console.error(
        "Error creating workout plan:",
        error.response ? error.response.data : error
      );
      setError(
        error.response?.data?.msg ||
          "Error creating workout plan. Please try again."
      );
      setSuccessMessage(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Create Workout Plan
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-300"
              rows="4"
              required
            />
          </div>
          {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
          {successMessage && (
            <p className="text-green-600 mb-4 font-medium">{successMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
          >
            Create Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutPlan;