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
    <>
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
          </div>
        ) : (
          // Puzzle Page Content
          <div className="">
            <p>All puzzles</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Nav;
