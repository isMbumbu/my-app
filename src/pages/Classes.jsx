import axios from 'axios';
import { useEffect, useState } from 'react';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure the token is stored in localStorage
        const response = await axios.get('https://simple-gymbuddy.onrender.com/class', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClasses(response.data.classes); // Ensure the response data is correctly accessed
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        setError('Failed to fetch classes. Please try again later.');
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {classes.map((cls) => (
          <li key={cls.id}>{cls.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Classes;