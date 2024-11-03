"use client"; // Required for Next.js components that use client-side features
import React, { useEffect, useState } from "react";
import { auth } from '@/utils/firebase'; // Make sure this path is correct
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import Link from "next/link"; // Import Link from Next.js
import "./index.css";
import {
  getFirestore,
  doc,
  setDoc,
} from 'firebase/firestore';

const SignInForm = ({ onClose }: { onClose: () => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false); // State for reset password mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const db = getFirestore();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsRegister(!isRegister);
    setIsResetPassword(false); // Reset to avoid conflict with reset password mode

    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store additional user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
      });
  
      console.log('User registered successfully:', username, email);
      // Redirect or show success message
    } catch (error) {
      console.error('Registration error:', error);
 
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/weak-password':
            setErrorMessage('Password should be at least 6 characters.');
            break;
          case 'auth/user-not-found':
              setErrorMessage('No user found with this email.');
              break;
            case 'auth/invalid-email':
              setErrorMessage('Invalid email format.');
              break;
          case 'auth/email-already-in-use':
            setErrorMessage('This email is already registered. Please log in or use a different email.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('The email address is not valid.');
            break;
          default:
            setErrorMessage('Failed to send password reset email. Please try again.');
        }
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    } 
    finally {
      setIsLoading(false); // Reset loading state
    }

  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in using email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in successfully:', user);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof FirebaseError) {
        switch(error.code){
            case 'auth/invalid-email':
            setErrorMessage('Invalid email format.');
            break;
            case 'auth/user-disabled':
            setErrorMessage('This account has been disabled.');
            break;
            case 'auth/user-not-found':
            setErrorMessage('No user found with this email.');
            break;
            case 'auth/wrong-password':
            setErrorMessage('Incorrect password.');
            break;
            case 'auth/too-many-requests':
            setErrorMessage('Too many login attempts. Please try again later.');
            break;
            case 'auth/network-request-failed':
            setErrorMessage('Network error. Please check your internet connection.');
            break;
            case 'auth/internal-error':
            setErrorMessage('An error occurred. Please try again.');
            break;
            case 'auth/operation-not-allowed':
            setErrorMessage('Sign-in with email/password is disabled.');
            break;
            case 'auth/invalid-api-key':
            setErrorMessage('Invalid API key. Please check your configuration.');
            break;
            case 'auth/invalid-credential':
            setErrorMessage('Invalid credentials. Please check your email/password again.');
            break;
            default:
                setErrorMessage('An unexpected error occurred.');
        }
      } 
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsResetPassword(true);
    setIsRegister(false); // Ensure we're not in register mode

    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      if (error instanceof FirebaseError) {
        switch(error.code){
          case 'auth/user-not-found':
            setErrorMessage('No user found with this email.');
          case 'auth/invalid-email':
            setErrorMessage('Invalid email format.');
          default:
            setErrorMessage('Failed to send password reset email. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-in-form">
      <button className="close-button" onClick={onClose} aria-label="Close">
        &times; {/* Close symbol */}
      </button>
      <div className="signIn">
        <h2> {isRegister ? "Register" : isResetPassword ? "Reset Password" : "Sign In"}</h2>
        <form onSubmit={isRegister ? handleRegister : isResetPassword ? handleResetPassword : handleSignIn}>
          {isRegister && (
            <div>
              <label htmlFor="username">Username:</label>
              <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              />
            </div>
          )}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isResetPassword && (
            <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          )}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {message && <p style={{ color: 'black' }}>{message}</p>}

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

import { User } from 'firebase/auth';

const Nav = () => {
  const [activeLink, setActiveLink] = useState("/");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSignInForm, setShowSignInForm] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user from state after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Function to handle link click
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  // Function to toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); // Toggle the dropdown
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
        {user ? (
          <div className="profile-area">
            <span>{user.displayName || user.email}</span>
            <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
          </div>
        ) : (
          <button className="container3" onClick={() => setShowSignInForm(true)}>
            <img src="/profile.svg" alt="Profile" />
            Sign In/Register
          </button>
        )}
      </div>
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
function setUser(currentUser: import("@firebase/auth").User | null) {
  throw new Error("Function not implemented.");
}

