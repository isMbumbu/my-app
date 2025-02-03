import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgressTracking = () => {
    const [progressLogs, setProgressLogs] = useState([]);
    const [formData, setFormData] = useState({ weight: '', reps: '', sets: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProgressLogs();
    }, []);

    const fetchProgressLogs = async () => {
        try {
            const memberId = localStorage.getItem('member_id'); // Ensure you store member_id when logging in
            const response = await axios.get(`/progress/${memberId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setProgressLogs(response.data);
        } catch (error) {
            console.error('Failed to fetch progress logs:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogProgress = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/log-progress', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setFormData({ weight: '', reps: '', sets: '' });
            fetchProgressLogs(); // Refresh list
        } catch (error) {
            console.error('Error logging progress:', error);
        }
    };

    const handleEdit = (log) => {
        setEditingId(log.id);
        setFormData({ weight: log.weight, reps: log.reps, sets: log.sets });
    };

    const handleUpdateProgress = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/progress/${editingId}`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setEditingId(null);
            setFormData({ weight: '', reps: '', sets: '' });
            fetchProgressLogs(); // Refresh list
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    return (
        <div className="container">
            <h1>Progress Tracking</h1>
            <form onSubmit={editingId ? handleUpdateProgress : handleLogProgress}>
                <input type="number" name="weight" placeholder="Weight" value={formData.weight} onChange={handleInputChange} required />
                <input type="number" name="reps" placeholder="Reps" value={formData.reps} onChange={handleInputChange} required />
                <input type="number" name="sets" placeholder="Sets" value={formData.sets} onChange={handleInputChange} required />
                <button type="submit">{editingId ? 'Update Progress' : 'Log Progress'}</button>
            </form>
            <ul>
                {progressLogs.map(log => (
                    <li key={log.id}>
                        <p>Weight: {log.weight}</p>
                        <p>Reps: {log.reps}</p>
                        <p>Sets: {log.sets}</p>
                        <p>Date: {new Date(log.date).toLocaleDateString()}</p>
                        <button onClick={() => handleEdit(log)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProgressTracking;