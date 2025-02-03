import React, { useEffect, useState } from "react";
import axios from "axios";

const ClassScheduling = () => {
    const [classes, setClasses] = useState([]);
    const [bookedClasses, setBookedClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchClasses();
        fetchBookedClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                const token = localStorage.getItem("token"); // Get the token
                console.log("Token:", token);
    
                if (!token) {
                    setError("Token not found. Please log in again.");
                    return;
                }
    
                const response = await axios.get("https://simple-gymbuddy.onrender.com/class", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token
                    },
                });
    
                console.log("Fetched classes:", response.data.classes); // Verify the structure of the fetched classes
    
                setClasses(response.data.classes || []); // Use the response data here
            } else {
                console.error("localStorage is not available in this environment.");
                setError("localStorage is not available.");
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            setError("Failed to fetch classes. Please try again.");
        }
    };
    

    const fetchBookedClasses = async () => {
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                const token = localStorage.getItem("token"); // Get the token
                const member_id = localStorage.getItem("member_id"); // Get the member_id

                if (!member_id) {
                    setError("Member ID not found. Please log in again.");
                    return;
                }

                const response = await axios.get("https://simple-gymbuddy.onrender.com/bookings", {
                    params: { member_id },
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token
                    },
                });

                console.log("Fetched booked classes:", response.data.bookings); // Log the response

                setBookedClasses(response.data.bookings || []); // Use the response data here
            } else {
                console.error("localStorage is not available in this environment.");
                setError("localStorage is not available.");
            }
        } catch (error) {
            console.error("Error fetching booked classes:", error);
            setError("Failed to fetch booked classes. Please try again.");
        }
    };

    const handleBookClass = async (e) => {
        e.preventDefault();
    
        if (!selectedClassId || !startTime || !endTime) {
            setError("Please select a class and provide start/end times.");
            return;
        }
    
        if (new Date(startTime) >= new Date(endTime)) {
            setError("Start time must be before end time.");
            return;
        }
    
        try {
            const token = localStorage.getItem("token"); // Get the token
            if (!token) {
                setError("Token not found. Please log in again.");
                return;
            }
    
            const selectedClass = classes.find((cls) => cls.id === parseInt(selectedClassId));
            if (!selectedClass) {
                setError("Class not found.");
                return;
            }
    
            const { trainer_id } = selectedClass; // Extract trainer_id from the selected class
            if (!trainer_id) {
                setError("Trainer not found for the selected class.");
                return;
            }
    
            // Log the data being sent to the server
            console.log("Booking data:", {
                class_id: selectedClassId,
                trainer_id: trainer_id,
                start_time: startTime,
                end_time: endTime,
            });
    
            // Book the class by sending the booking request to the server
            const response = await axios.post(
                "https://simple-gymbuddy.onrender.com/book-class",
                {
                    class_id: selectedClassId,
                    trainer_id: trainer_id,
                    start_time: startTime,
                    end_time: endTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                console.log("Class booked successfully:", response.data);
                setSuccess("Class booked successfully!");
                setError("");
                setSelectedClassId("");
                setStartTime("");
                setEndTime("");
                setTimeout(() => setSuccess(""), 3000);
    
                // Refresh booked classes
                fetchBookedClasses();
            } else {
                throw new Error(response.data.message || "Unknown error occurred while booking.");
            }
        } catch (error) {
            console.error("Error booking class:", error);
            setError(error.response?.data?.msg || error.message || "Failed to book class. Please try again.");
            setSuccess("");
        }
    };
    
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Class Scheduling</h1>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Available Classes</h2>
                <form onSubmit={handleBookClass}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Select Class</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                console.log("Selected class ID:", e.target.value); // Log the selected class ID
                            }}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="">Select a class</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} - {cls.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Start Time</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-200"
                    >
                        Book Class
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Booked Classes</h2>
                {bookedClasses.length > 0 ? (
                    <ul>
                        {bookedClasses.map((booking) => (
                            <li key={booking.id} className="mb-4 p-4 border border-gray-200 rounded">
                                <p>
                                    <strong>Class:</strong> {booking.class_.name} - {booking.class_.description}
                                </p>
                                <p>
                                    <strong>Time:</strong> {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No classes booked yet.</p>
                )}
            </div>
        </div>
    );
};

export default ClassScheduling;
