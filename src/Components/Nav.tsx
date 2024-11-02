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
        <div className="container3">
          <img src="/profile.svg" alt="Profile" />
          Sign in/Register
        </div>
      </div>

      {/* Conditional rendering based on active link */}
      <div className="">
        {activeLink === "/" ? (
          // Home Page Content
          <div className="puzzles">
            <p>Puzzles of the week</p>
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
