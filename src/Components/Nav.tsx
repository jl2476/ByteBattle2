"use client"; // Required for Next.js components that use client-side features
import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js
import "./index.css";

const SignInForm = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false); // State to toggle between Sign In and Register

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="sign-in-form">
      <button className="close-button" onClick={onClose} aria-label="Close">
        &times; {/* Close symbol */}
      </button>
      <div className="signIn">
        <h2>{isRegister ? 'Register' : 'Sign In'}</h2>
        <form>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required />
          
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required />
          
          {isRegister && (
            <>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" required />
            </>
          )}
          
          <button type="submit" className="submit">{isRegister ? 'Register' : 'Submit'}</button>
        </form>
        <p onClick={toggleForm} style={{ cursor: 'pointer', color: '#007bff' }}>
          {isRegister ? 'Already have an account? Sign In' : 'Don’t have an account? Register'}
        </p>
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
                <button className="play">Play</button>
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
              <div className="puzzles3"></div>
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
