//import { firestore } from '@/firebase'
import {
  getFirestore,
  doc,
  setDoc,
} from 'firebase/firestore'
import React, { useState } from 'react';
import { auth } from '@/utils/firebase'; // Import the Firebase auth
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const db = getFirestore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
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

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  };  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
