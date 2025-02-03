import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWorkoutPlan from '../../pages/CreateWorkoutPlan';
import MemberList from '../../pages/MemberList';
import axios from 'axios';

const Dashboard = () => {
    const [bookedClasses, setBookedClasses] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [classes, setClasses] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [className, setClassName] = useState('');
    const [classDescription, setClassDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = () => {
            const storedEmail = localStorage.getItem('email');
            const storedRole = localStorage.getItem('role');
    
            if (!storedEmail || !storedRole) {
                alert('You are not logged in or role information is missing. Redirecting to login.');
                navigate('/login');
                return;
            }
    
            setEmail(storedEmail);
            setRole(storedRole);
        };
    
        fetchUserInfo();
    }, [navigate]);
    
    useEffect(() => {
        if (email && role) {
            const token = localStorage.getItem('token');

            if (role === 'Trainer') {
                // Fetch booked classes for the trainer
                axios.get('https://simple-gymbuddy.onrender.com/bookings', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(response => {
                    setBookedClasses(response.data.bookings || []);
                })
                .catch(error => {
                    console.error("Error fetching booked classes:", error);
                    setError("Failed to fetch booked classes. Please try again.");
                });

                // Fetch workout plans
                axios.get('https://simple-gymbuddy.onrender.com/workout-plans', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(response => {
                    setWorkoutPlans(response.data.workout_plans || []);
                })
                .catch(error => {
                    console.error("Error fetching workout plans:", error);
                });

                // Fetch classes
                axios.get('https://simple-gymbuddy.onrender.com/class', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(response => {
                    setClasses(response.data.classes || []);
                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });

                // Fetch members
                axios.get('https://simple-gymbuddy.onrender.com/members', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(response => {
                    setMembers(response.data || []);
                })
                .catch(error => {
                    console.error("Error fetching members:", error);
                });
            } else if (role === 'Member') {
                // Fetch booked classes for the member
                axios.get('https://simple-gymbuddy.onrender.com/bookings', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(response => {
                    setBookedClasses(response.data.bookings || []);
                })
                .catch(error => {
                    console.error("Error fetching booked classes:", error);
                    setError("Failed to fetch booked classes. Please try again.");
                });
            }
        }
    }, [email, role]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        alert('Logged out successfully.');
        navigate('/login');
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEmail(localStorage.getItem('email'));
        setRole(localStorage.getItem('role'));
    };

    const handleUpdate = () => {
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);
        setEditMode(false);
        alert('Account details updated successfully!');
    };

    const handleCreateClass = (e) => {
        e.preventDefault();

        const newClass = {
            name: className,
            description: classDescription,
        };

        axios.post('https://simple-gymbuddy.onrender.com/class', newClass, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(response => {
            alert('Class created successfully!');
            setClasses([...classes, response.data.class]);
            setClassName('');
            setClassDescription('');
        })
        .catch(error => {
            console.error("Error creating class:", error);
            alert('Failed to create class. Please try again.');
        });
    };

    const assignMemberToClass = async (memberId, classId) => {
        if (!memberId || !classId) {
            alert("Please select both a member and a class.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://simple-gymbuddy.onrender.com/assign_member_to_class",
                { member_id: memberId, class_id: classId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            setSelectedMemberId('');
            setSelectedClassId('');
        } catch (error) {
            console.error("Error assigning member to class:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Failed to assign member to class. Please try again.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            {!email || !role ? (
                <p>Loading user information...</p>
            ) : (
                <div>
                    <p>Welcome, {email}!</p>
                    <p>Your role: {role}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-200"
                        aria-label="Log out"
                    >
                        Log Out
                    </button>

                    {/* Edit Account Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Edit Account</h2>
                        {editMode ? (
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-2 mb-2 border border-gray-300 rounded w-full"
                                    placeholder="Email"
                                />
                                {role === 'Admin' && (
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="p-2 mb-2 border border-gray-300 rounded w-full"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Trainer">Trainer</option>
                                        <option value="Member">Member</option>
                                    </select>
                                )}
                                <div className="mt-4">
                                    <button
                                        onClick={handleUpdate}
                                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-200 mr-2"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>Email: {email}</p>
                                <p>Role: {role}</p>
                                <button
                                    onClick={handleEdit}
                                    className="mt-4 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition-all duration-200"
                                >
                                    Edit Account
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Booked Classes Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Booked Classes</h2>
                        {bookedClasses.length > 0 ? (
                            <ul>
                                {bookedClasses.map((booking) => (
                                    <li key={booking.id} className="mb-4 p-4 border border-gray-200 rounded">
                                        <p><strong>Class:</strong> {booking.class_.name} - {booking.class_.description}</p>
                                        <p>
                                            <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No booked classes found.</p>
                        )}
                    </div>

                    {/* Other Sections */}
                    {role === 'Trainer' && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Manage Classes</h2>
                            <form onSubmit={handleCreateClass}>
                                <input
                                    type="text"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    className="p-2 mb-2 border border-gray-300 rounded w-full"
                                    placeholder="Class Name"
                                />
                                <input
                                    type="text"
                                    value={classDescription}
                                    onChange={(e) => setClassDescription(e.target.value)}
                                    className="p-2 mb-2 border border-gray-300 rounded w-full"
                                    placeholder="Class Description"
                                />
                                <button
                                    type="submit"
                                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-200"
                                >
                                    Create Class
                                </button>
                            </form>
                        </div>
                    )}

                    {role === 'Trainer' && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Assign Members to Class</h2>
                            <div>
                                <select
                                    value={selectedMemberId}
                                    onChange={(e) => setSelectedMemberId(e.target.value)}
                                    className="p-2 mb-2 border border-gray-300 rounded w-full"
                                >
                                    <option value="">Select Member</option>
                                    {members.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="p-2 mb-2 border border-gray-300 rounded w-full"
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((classItem) => (
                                        <option key={classItem.id} value={classItem.id}>
                                            {classItem.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => assignMemberToClass(selectedMemberId, selectedClassId)}
                                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-200"
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
