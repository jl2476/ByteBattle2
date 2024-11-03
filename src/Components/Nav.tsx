"use client"; // Required for Next.js components that use client-side features
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import Link from Next.js
import "./index.css";
import { useNavigate } from "react-router-dom";
import CountdownPlayButton from "./CountdownPlayButton";

const SignInForm = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false); // State for reset password mode

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setIsResetPassword(false); // Reset to avoid conflict with reset password mode
  };

  const handleResetPassword = () => {
    setIsResetPassword(true);
    setIsRegister(false); // Ensure we're not in register mode
  };

  return (
    <div className="sign-in-form">
      <button className="close-button" onClick={onClose} aria-label="Close">
        &times; {/* Close symbol */}
      </button>
      <div className="signIn">
        <h2>
          {isRegister
            ? "Register"
            : isResetPassword
            ? "Reset Password"
            : "Sign In"}
        </h2>
        <form>
          {isRegister && (
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" required />
            </div>
          )}
          {!isResetPassword && (
            <>
              <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" required />
              </div>
            </>
          )}
          {isResetPassword && (
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" required />
            </div>
          )}

          <div className="form-buttons">
            {!isRegister && !isResetPassword && (
              <p
                onClick={() => {
                  setIsResetPassword(true);
                }}
                style={{ cursor: "pointer", color: "#02246F" }}
              >
                Reset password
              </p>
            )}
            <button type="submit" className="submit">
              {isRegister ? "Register" : isResetPassword ? "Submit" : "Sign In"}
            </button>

            <p
              onClick={() => {
                setIsRegister(!isRegister);
                setIsResetPassword(false);
              }}
              style={{ cursor: "pointer", color: "#02246F", marginTop: "16px" }}
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don’t have an account? Register"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const Nav = () => {
  // State to manage the active link and content
  const [activeLink, setActiveLink] = useState("/");

  // State to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Function to handle link click
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  // Function to toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); // Toggle the dropdown
  };

  const [showSignInForm, setShowSignInForm] = useState(false);

  return (
    <div className="nav-container">
      {" "}
      {/* Wrap everything in a div for relative positioning */}
      <img src="/image.png" className="background-image" alt="Background" />
      <div className="container1">
        <p className="logo">ByteBattle</p>
        <div className="container2">
          <Link
            href="/"
            className={`home ${activeLink === "/" ? "active" : ""}`}
            onClick={() => handleLinkClick("/")}
          >
            <img src="/home.svg" alt="Home" />
            Home
          </Link>
          <Link
            href="/puzzle"
            className={`home ${activeLink === "/puzzle" ? "active" : ""}`}
            onClick={() => handleLinkClick("/puzzle")}
          >
            <img src="/puzzle.svg" alt="Puzzle" />
            Puzzle
          </Link>
        </div>
        <button className="container3" onClick={() => setShowSignInForm(true)}>
          <img src="/profile.svg" alt="Profile" />
          Sign in/Register
        </button>
      </div>
      {/* Render the SignInForm when showSignInForm is true */}
      {showSignInForm && (
        <div className="form-overlay">
          <SignInForm onClose={() => setShowSignInForm(false)} />
        </div>
      )}
      {/* Conditional rendering based on active link */}
      <div className="">
        {activeLink === "/" ? (
          // Home Page Content
          <div className="BigPuzz">
            <div className="bigPuzz">
              <div className="puzzles">
                <p className="PuzWeek">Puzzles of the week</p>
                <div className="Prepuz">
                  <div className="puz">
                    <img src="/puzzle.svg" alt="Puzzle" />
                    <p>Sum it up</p>
                    <p>Easy</p>
                  </div>
                  <div className="puz">
                    <img src="/puzzle.svg" alt="Puzzle" />
                    <p>Sum it up</p>
                    <p>Easy</p>
                  </div>
                  <div className="puz">
                    <img src="/puzzle.svg" alt="Puzzle" />
                    <p>Sum it up</p>
                    <p>Easy</p>
                  </div>
                  <div className="puz">
                    <img src="/puzzle.svg" alt="Puzzle" />
                    <p>Sum it up</p>
                    <p>Easy</p>
                  </div>
                  <div className="puz">
                    <img src="/puzzle.svg" alt="Puzzle" />
                    <p>Sum it up</p>
                    <p>Easy</p>
                  </div>
                  <div className="puz">
                    <img src="/puzzle.svg" alt="Puzzle" />
                    <p>Sum it up</p>
                    <p>Easy</p>
                  </div>
                  <div className="puz">
                    <img src="/puzzle.svg" alt="Puzzle" />
                    <p>Sum it up</p>
                    <p>Easy</p>
                  </div>
                </div>
              </div>

              {/* dropdown */}
              <div className="puzzles">
                <p className="PuzWeek">FAQ</p>
                <div className="drop">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div className="dropdown" key={index}>
                      <button
                        className="dropbtn"
                        onClick={() => toggleDropdown(index)}
                      >
                        What is this supposed to be?
                        <span className="arrow">
                          <img src="/arrow_down.svg" alt="Arrow" />
                        </span>
                      </button>
                      {openDropdown === index && (
                        <div className="dropdown-content">
                          <p>This is a dropdown content!</p>
                          <p>You can add more information here.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="midPuzz">
              <div className="puzzles2">
                <p className="code">1v1 Speed Coding</p>
                <p className="code2">
                  Challenge your coding skills in real-time with head to head
                  speed coding matches
                </p>
                <div>
                  <button className="play">Play</button>
                  {/* {isCountingDown ? (
                    <div className="countdown">
                      <p>Time left: {formatTime(timeLeft)}</p>
                    </div>
                  ) : (
                    <button className="play" onClick={startCountdown}>
                      Play
                    </button>

                  )} */}
                
                </div>
              </div>
              <div className="puzzles4">
                <p>Leaderboard</p>

                <div className="leaderboard">
                  <p>Rank</p>
                  <p>Name</p>
                  <p>Speed</p>
                  <p>Difficulity</p>
                </div>
              </div>
            </div>
            <div className="midPuzz">
              <div className="puzzles3">
                <div className="profile">
                  <img src="/profile.svg"></img>
                </div>
              </div>
              <div className="puzzles3">
                <p>Match History</p>
                <div className="history">
                  <p>You</p>
                  <p>VS</p>
                  <p>Someone else</p>
                  <div className="star">
                    <p>-3</p>
                    <img src="/star.svg"></img>
                  </div>
                </div>
                <div className="history">
                  <p>You</p>
                  <p>VS</p>
                  <p>Someone else</p>
                  <div className="star">
                    <p>-3</p>
                    <img src="/star.svg"></img>
                  </div>
                </div>
                <div className="history">
                  <p>You</p>
                  <p>VS</p>
                  <p>Someone else</p>
                  <div className="star">
                    <p>-3</p>
                    <img src="/star.svg"></img>
                  </div>
                </div>
                <div className="history1">
                  <p>You</p>
                  <p>VS</p>
                  <p>Someone else</p>
                  <div className="star">
                    <p>-3</p>
                    <img src="/star.svg"></img>
                  </div>
                </div>
                <div className="history1">
                  <p>You</p>
                  <p>VS</p>
                  <p>Someone else</p>
                  <div className="star">
                    <p>-3</p>
                    <img src="/star.svg"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Puzzle Page Content
          <div className="">
            <p>All puzzles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
