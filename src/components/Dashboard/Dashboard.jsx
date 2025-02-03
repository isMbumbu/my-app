import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWorkoutPlan from '../../pages/CreateWorkoutPlan';
import MemberList from '../../pages/MemberList';
import axios from 'axios';

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
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
            const storedId = localStorage.getItem('id');

            if (!storedEmail || !storedRole || !storedId) {
                alert('You are not logged in or role information is missing. Redirecting to login.');
                navigate('/login');
                return;
            }

            setUserInfo({ email: storedEmail, role: storedRole, id: storedId });
            setEmail(storedEmail);
            setRole(storedRole);
        };

        fetchUserInfo();
    }, [navigate]);

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'Trainer') {
                // Fetch booked classes for the trainer
                axios.get(`https://simple-gymbuddy.onrender.com/bookings?trainer_id=${userInfo.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(response => {
                    setBookedClasses(response.data.bookings || []);
                })
                .catch(error => {
                    console.error("Error fetching booked classes:", error);
                    setError("Failed to fetch booked classes. Please try again.");
                });

                // Fetch workout plans
                axios.get(`https://simple-gymbuddy.onrender.com/workout-plans`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(response => {
                    setWorkoutPlans(response.data.workout_plans || []);
                })
                .catch(error => {
                    console.error("Error fetching workout plans:", error);
                });

                // Fetch classes
                axios.get(`https://simple-gymbuddy.onrender.com/class`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(response => {
                    setClasses(response.data.classes || []);
                })
                .catch(error => {
                    console.error("Error fetching classes:", error);
                });

                // Fetch members
                axios.get(`https://simple-gymbuddy.onrender.com/members`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(response => {
                    setMembers(response.data || []);
                })
                .catch(error => {
                    console.error("Error fetching members:", error);
                });
            } else if (userInfo.role === 'Member') {
                // Fetch booked classes for the member
                axios.get(`https://simple-gymbuddy.onrender.com/bookings?member_id=${userInfo.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    }, [userInfo]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        alert('Logged out successfully.');
        navigate('/login');
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEmail(userInfo.email);
        setRole(userInfo.role);
    };

    const handleUpdate = () => {
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);
        setUserInfo({ ...userInfo, email, role });
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
            {userInfo === null ? (
                <p>Loading user information...</p>
            ) : (
                <div>
                    <p>Welcome, {userInfo.email}!</p>
                    <p>Your role: {userInfo.role}</p>
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
                                {userInfo.role === 'Admin' && (
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
                                <p>Email: {userInfo.email}</p>
                                <p>Role: {userInfo.role}</p>
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
                                            <strong>Time:</strong> {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No classes booked yet.</p>
                        )}
                    </div>

                    {/* Trainer-Specific Sections */}
                    {userInfo.role === 'Trainer' && (
                        <div>
                            {/* Create Workout Plan Section */}
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold mb-2">Create Workout Plan</h2>
                                <CreateWorkoutPlan />
                                <h3 className="text-lg font-semibold mt-4">Your Workout Plans</h3>
                                <ul>
                                    {workoutPlans.map(plan => (
                                        <li key={plan.id}>
                                            <strong>{plan.name}</strong>: {plan.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Create Class Section */}
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold mb-2">Create Class</h2>
                                <form onSubmit={handleCreateClass}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Class Name</label>
                                        <input
                                            type="text"
                                            value={className}
                                            onChange={(e) => setClassName(e.target.value)}
                                            className="p-2 border border-gray-300 rounded w-full"
                                            placeholder="Enter class name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Class Description</label>
                                        <textarea
                                            value={classDescription}
                                            onChange={(e) => setClassDescription(e.target.value)}
                                            className="p-2 border border-gray-300 rounded w-full"
                                            placeholder="Enter class description"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-200"
                                    >
                                        Create Class
                                    </button>
                                </form>

                                <h3 className="text-lg font-semibold mt-4">Your Classes</h3>
                                <ul>
                                    {classes.map(cls => (
                                        <li key={cls.id}>
                                            <strong>{cls.name}</strong>: {cls.description}
                                        </li>
                                    ))}
                                </ul>

                                {/* Assign Member to Class Section */}
                                <h3 className="text-lg font-semibold mt-4">Assign Member to Class</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Select Member</label>
                                    <select
                                        value={selectedMemberId}
                                        onChange={(e) => setSelectedMemberId(e.target.value)}
                                        className="p-2 border border-gray-300 rounded w-full"
                                    >
                                        <option value="">Select a Member</option>
                                        {members.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Select Class</label>
                                    <select
                                        value={selectedClassId}
                                        onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="p-2 border border-gray-300 rounded w-full"
                                    >
                                        <option value="">Select a class</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => assignMemberToClass(selectedMemberId, selectedClassId)}
                                    className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition-all duration-200"
                                >
                                    Assign Member
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Member List Section for Admin and Trainer */}
                    {(userInfo.role === 'Admin' || userInfo.role === 'Trainer') && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2">Members</h2>
                            <MemberList />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;