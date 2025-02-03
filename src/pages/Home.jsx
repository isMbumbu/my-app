import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>Welcome to GymBuddy!</h1>
        <p style={styles.paragraph}>Your ultimate fitness companion</p>
      </div>

      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>
          Login
        </Link>
        <Link to="/register" style={styles.button}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    minHeight: '100vh', // Ensure it takes at least the full height of the viewport
    backgroundImage: 'url(/kirill-bogomolov-WH15dpm1F1E-unsplash.jpg)', // Correct path to the image in the public folder
    backgroundSize: 'cover', // Ensures the background covers the entire container
    backgroundPosition: 'center', // Centers the image
    backgroundAttachment: 'fixed', // Optional: Keeps the background fixed when scrolling
    backgroundRepeat: 'no-repeat', // Avoid tiling if image is small
  },
  headerContainer: {
    padding: '50px',
    flex: '0 1 auto', // Make sure header takes only as much space as needed
  },
  header: {
    fontSize: '3em',
    color: '#fff', 
  },
  paragraph: {
    fontSize: '1.2em',
    color: '#fff', // Change to green
  },
  buttonContainer: {
    marginTop: '30px',
    flex: 1, // Make this container fill the remaining space
    display: 'flex',
    justifyContent: 'center', // Horizontally center buttons
    alignItems: 'center',
    gap: '20px', // Add some space between the buttons
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1em',
  },
};

export default Home;
