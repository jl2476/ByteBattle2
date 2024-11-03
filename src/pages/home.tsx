// Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
 // Adjust the path as necessary
 const CountdownPlayButton: React.FC = () => {
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const navigate = useNavigate();
  
    const startCountdown = () => {
      setIsCountingDown(true);
      setTimeLeft(300); // Reset to 5 minutes (300 seconds)
    };
  
    useEffect(() => {
      let countdownInterval: NodeJS.Timeout | undefined;
  
      if (isCountingDown && timeLeft > 0) {
        countdownInterval = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        navigate("/puzzle"); // Redirect when countdown ends
      }
  
      return () => clearInterval(countdownInterval); // Clean up interval on unmount
    }, [isCountingDown, timeLeft, navigate]);
  
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };
  
    return (
      <div>
        <button onClick={startCountdown} className="play">Play</button>
        {isCountingDown && <div>Time Left: {formatTime(timeLeft)}</div>}
      </div>
    );
  };
const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <CountdownPlayButton /> {/* This must be under a route provided by RouterProvider */}
    </div>
  );
};

export default Home;
