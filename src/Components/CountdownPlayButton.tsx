import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CountdownPlayButton: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isCountingDown, setIsCountingDown] = useState(false);
  const navigate = useNavigate();

  const startCountdown = () => {
    setIsCountingDown(true);
    setTimeLeft(300); // Reset to 5 minutes (300 seconds)

    // Use a timer to manage countdown without useEffect
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          navigate("/next-page"); // Redirect when countdown ends
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div>
      <button onClick={startCountdown} className="play">
        {isCountingDown ? "Counting Down..." : "Play"}
      </button>
      {isCountingDown && <div>Time Left: {formatTime(timeLeft)}</div>}
    </div>
  );
};

export default CountdownPlayButton;
