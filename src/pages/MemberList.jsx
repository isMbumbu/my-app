import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            const token = localStorage.getItem('token');
    
            if (!token) {
                alert('No token found. Redirecting to login.');
                navigate('/login');
                return;
            }
    
            try {
                const response = await fetch('https://simple-gymbuddy.onrender.com/members', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    if (response.status === 403) {
                        alert('Access denied.');
                        navigate('/dashboard');
                    } else {
                        throw new Error('Error fetching members.');
                    }
                } else {
                    const data = await response.json();
                    console.log(data); // Debug: view fetched data
                    setMembers(data);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Network or server error. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchMembers();
    }, [navigate]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in.');
            return;
        }
    
        try {
            const response = await axios.delete(`https://simple-gymbuddy.onrender.com/members/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log(response);  // Debugging: Check full response
            if (response.status === 200) {
                setMembers(members.filter(member => member.id !== id));
            } else {
                alert(response.data.msg || "Failed to delete member.");
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert(`Failed to delete member: ${error.response ? error.response.data.msg : error.message}`);
        }
    };

    // Handle update
    const handleUpdate = async (e) => {
        e.preventDefault();
    
        // Retrieve token from localStorage
        const token = localStorage.getItem('token');
    
        if (!token) {
            alert('You are not logged in.');
            return;
        }
    
        try {
            const response = await axios.put(
                `https://simple-gymbuddy.onrender.com/members/${selectedMember.id}`, 
                selectedMember, 
                { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
    
            // If the request is successful, update the members list
            if (response.status === 200) {
                setMembers(members.map(member => 
                    member.id === selectedMember.id ? selectedMember : member
                ));
                setEditMode(false);
                setSelectedMember(null);
            } else {
                alert(response.data.msg || "Failed to update member.");
            }
        } catch (error) {
            console.error('Error updating member:', error);  // Log full error object
    
            if (error.response && error.response.status === 403) {
                alert('Access denied. You are not authorized to update this member.');
            } else {
                alert(`Failed to update member: ${error.response ? error.response.data.message : error.message}`);
            }
        }
    };
    
    

    // Filter members based on the search term
    const filteredMembers = members.filter(member => 
        (member.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (member.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (String(member.role).toLowerCase().includes(searchTerm.toLowerCase())) // Ensure role is a string
    );

    if (loading) return <p>Loading members...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Member List</h2>
            
            <input
                type="text"
                placeholder="Search by name, email, or role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            
            {editMode && selectedMember && (
                <form onSubmit={handleUpdate} className="mb-4">
                    <h3 className="text-lg font-semibold">Update Member</h3>
                    <div className="mb-2">
                        <label>Name</label>
                        <input
                            type="text"
                            value={selectedMember.name}
                            onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label>Email</label>
                        <input
                            type="email"
                            value={selectedMember.email}
                            onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label>Role</label>
                        <input
                            type="text"
                            value={selectedMember.role}
                            onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update</button>
                    <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="ml-2 bg-gray-300 text-black p-2 rounded"
                    >
                        Cancel
                    </button>
                </form>
            )}

            {filteredMembers.length === 0 ? (
                <p className="text-gray-600">No members found.</p>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Role</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map(({ id, name, email, role }) => (
                            <tr key={id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{id}</td>
                                <td className="border px-4 py-2">{name}</td>
                                <td className="border px-4 py-2">{email}</td>
                                <td className="border px-4 py-2">{role}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                    {/* <button
                                        onClick={() => {
                                            setSelectedMember({ id, name, email, role });
                                            setEditMode(true);
                                        }}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MemberList;
