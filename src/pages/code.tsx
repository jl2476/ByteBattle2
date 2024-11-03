import "./home.css";
import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase"; 
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Link from "next/link"; 
import { User } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const SignInForm = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const db = getFirestore();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsRegister(!isRegister);
    setIsResetPassword(false); 

    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
     
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

    
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
      });

      console.log("User registered successfully:", username, email);
     
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/weak-password":
            setErrorMessage("Password should be at least 6 characters.");
            break;
          case "auth/email-already-in-use":
            setErrorMessage(
              "This email is already registered. Please log in or use a different email."
            );
            break;
          case "auth/invalid-email":
            setErrorMessage("The email address is not valid.");
            break;
          default:
            setErrorMessage(
              "An error occurred during registration. Please try again."
            );
        }
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User logged in successfully:", user);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            setErrorMessage("Invalid email format.");
            break;
          case "auth/user-disabled":
            setErrorMessage("This account has been disabled.");
            break;
          case "auth/user-not-found":
            setErrorMessage("No user found with this email.");
            break;
          case "auth/wrong-password":
            setErrorMessage("Incorrect password.");
            break;
          case "auth/too-many-requests":
            setErrorMessage("Too many login attempts. Please try again later.");
            break;
          case "auth/network-request-failed":
            setErrorMessage(
              "Network error. Please check your internet connection."
            );
            break;
          case "auth/internal-error":
            setErrorMessage("An error occurred. Please try again.");
            break;
          case "auth/operation-not-allowed":
            setErrorMessage("Sign-in with email/password is disabled.");
            break;
          case "auth/invalid-api-key":
            setErrorMessage(
              "Invalid API key. Please check your configuration."
            );
            break;
          case "auth/invalid-credential":
            setErrorMessage(
              "Invalid credentials. Please check your email/password again."
            );
            break;
          default:
            setErrorMessage("An unexpected error occurred.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsResetPassword(true);
    setIsRegister(false); 

    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setErrorMessage("No user found with this email.");
          case "auth/invalid-email":
            setErrorMessage("Invalid email format.");
          default:
            setErrorMessage(
              "Failed to send password reset email. Please try again."
            );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-in-form">
      <button className="close-button" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <div className="signIn">
        <h2>
          {" "}
          {isRegister
            ? "Register"
            : isResetPassword
            ? "Reset Password"
            : "Sign In"}
        </h2>
        <form
          onSubmit={
            isRegister
              ? handleRegister
              : isResetPassword
              ? handleResetPassword
              : handleSignIn
          }
        >
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
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {message && <p style={{ color: "black" }}>{message}</p>}

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

const Code = () => {
  const [activeLink, setActiveLink] = useState("/");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); /
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); 
  };
  const [activeSection, setActiveSection] = useState("testCases");

  const handleClick = (section) => {
    setActiveSection(section);
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const testCaseContent = [
    "Content for Test Case 1: Description or example here.",
    "Content for Test Case 2: Additional details here.",
    "Content for Test Case 3: Different example for case 3.",
    "Content for Test Case 4: More information for case 4.",
  ];

  return (
    <>
      <div className="nav-container">
        {" "}
        <img src="/image.png" className="background-image" alt="Background" />
        <div className="container1">
          <div className="navLeft">
            <Link href="/" className="logo">
              ByteBattle
            </Link>
            <div className="butn">
              <button className="prev">
                <img src="/prevButton.svg"></img>
                <p className="prob">Prev Problem</p>
              </button>
              <button className="prev">
                <p className="prob">Prev Problem</p>
                <img src="/nextButton.svg"></img>
              </button>
            </div>
          </div>
          <div className="timer">
            <p className="timeText">10:00</p>
            <button className="prev1">
              <p className="prob">Run</p>
            </button>
            <button className="prev2">
              <p className="prob">Submit</p>
            </button>
          </div>
          {user ? (
            <div className="container3">
              <img src="/profile.svg" alt="Profile" />
              <div className="user-info">
                {" "}
                <span>{user.displayName || user.email}</span>
                <button onClick={handleSignOut} className="sign-out-button">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              className="container3"
              onClick={() => setShowSignInForm(true)}
            >
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
      </div>
      <div className="bigPuzz">
        <div className="puzzles3">
          <div className="profile">
            <p className="sum">1: Two Sum</p>
            <div className="chall">
              <div className="easy">Easy</div>
              <div className="easy">Python</div>
            </div>
          </div>

          <div className="para">
            <p>
              Given an array of integers <code>nums</code> and an integer{" "}
              <code>target</code>, return indices of the two numbers such that
              they add up to <code>target</code>.
            </p>
            <p>
              You may assume that each input would have exactly one solution,
              and you may not use the same element twice. You can return the
              answer in any order.
            </p>
            <p>
              <strong>Example 1:</strong> Input: nums = [2,7,11,15], target = 9{" "}
              <br />
              Output: [0,1] <br />
              Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
            </p>
            <p>
              <strong>Example 2:</strong> Input: nums = [3,2,4], target = 6{" "}
              <br />
              Output: [1,2]
            </p>
            <p>
              <strong>Example 3:</strong> Input: nums = [3,3], target = 6 <br />
              Output: [0,1]
            </p>
            <p>Constraints:</p>
            <ul>
              <li>2 &le; nums.length &le; 104</li>
              <li>-109 &le; nums[i] &le; 109</li>
              <li>-109 &le; target &le; 109</li>
              <li>Only one valid answer exists.</li>
            </ul>
          </div>
        </div>
        <div className="smallPuzz">
          <div className="puzzles4"></div>
          <div className="puzzles5">
          
            <div className="navigation">
              <button onClick={() => handleClick("testCases")}>
                Test Cases
              </button>
              <button onClick={() => handleClick("terminal")}>Terminal</button>
            </div>

        
            {activeSection === "testCases" && (
              <div className="test">
              
                {[
                  "Test Case 1",
                  "Test Case 2",
                  "Test Case 3",
                  "Test Case 4",
                ].map((caseName, index) => (
                  <div
                    key={index}
                    className="test-case-container"
                    onClick={() => handleClick(index)}
                  >
                    <p className={`test-case`}>{caseName}</p>
                  </div>
                ))}
                
                {activeIndex !== null && (
                  <div className="test-case-content">
                    <p>{testCaseContent[activeIndex]}</p>
                  </div>
                )}
              </div>
            )}

            {activeSection === "terminal" && (
              <div className="terminal-section">
                <p>Terminal Output</p>
                
                <div className="terminal-content">
                  <p>Output will be displayed here...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Code;
