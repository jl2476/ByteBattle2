"use client"; // Required for Next.js components that use client-side features
import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js
import "./index.css";

const Nav = () => {
  // State to manage the active link and content
  const [activeLink, setActiveLink] = useState("/");

  // Function to handle link click
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

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
        <button className="container3">
          <img src="/profile.svg" alt="Profile" />
          Sign in/Register
        </button>
      </div>
      {/* Conditional rendering based on active link */}
      <div className="">
        {activeLink === "/" ? (
          // Home Page Content
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

            <div className="puzzles">
              <p className="PuzWeek">FAQ</p>
              <div className="drop">
                {" "}
                <div className="dropdown">
                  <button className="dropbtn">
                    What is this supposed to be?
                    <span className="arrow">
                      <img src="/arrow_down.svg"></img>
                    </span>
                  </button>
                  <div className="dropdown-content">
                    <p>This is a dropdown content!</p>
                    <p>You can add more information here.</p>
                  </div>
                </div>
                <div className="dropdown">
                  <button className="dropbtn">
                    What is this supposed to be?
                    <span className="arrow">
                      <img src="/arrow_down.svg"></img>
                    </span>
                  </button>
                  <div className="dropdown-content">
                    <p>This is a dropdown content!</p>
                    <p>You can add more information here.</p>
                  </div>
                </div>
                <div className="dropdown">
                  <button className="dropbtn">
                    What is this supposed to be?
                    <span className="arrow">
                      <img src="/arrow_down.svg"></img>
                    </span>
                  </button>
                  <div className="dropdown-content">
                    <p>This is a dropdown content!</p>
                    <p>You can add more information here.</p>
                  </div>
                </div>
                <div className="dropdown">
                  <button className="dropbtn">
                    What is this supposed to be?
                    <span className="arrow">
                      <img src="/arrow_down.svg"></img>
                    </span>
                  </button>
                  <div className="dropdown-content">
                    <p>This is a dropdown content!</p>
                    <p>You can add more information here.</p>
                  </div>
                </div>
                <div className="dropdown">
                  <button className="dropbtn">
                    What is this supposed to be?
                    <span className="arrow">
                      <img src="/arrow_down.svg"></img>
                    </span>
                  </button>
                  <div className="dropdown-content">
                    <p>This is a dropdown content!</p>
                    <p>You can add more information here.</p>
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
