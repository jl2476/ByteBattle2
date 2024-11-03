import {
  getFirestore,
  doc,
  setDoc,
} from 'firebase/firestore'
import React, { useState } from 'react';
<<<<<<< HEAD
import { auth } from '@/utils/firebase'; 
=======
import { auth } from '../utils/firebase';
>>>>>>> b0d4bc568c010a1e99436460ac8acb2e3efdbc24
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const db = getFirestore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
  
    try {
<<<<<<< HEAD
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
=======
   
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      
>>>>>>> b0d4bc568c010a1e99436460ac8acb2e3efdbc24
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
      });
  
      console.log('User registered successfully:', username, email);
<<<<<<< HEAD
=======
      
>>>>>>> b0d4bc568c010a1e99436460ac8acb2e3efdbc24
    } catch (error) {
      console.error('Registration error:', error);
 
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/weak-password':
            setErrorMessage('Password should be at least 6 characters.');
            break;
          case 'auth/email-already-in-use':
            setErrorMessage('This email is already registered. Please log in or use a different email.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('The email address is not valid.');
            break;
          default:
            setErrorMessage('An error occurred during registration. Please try again.');
        }
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    } 
    finally {
      setIsLoading(false); 
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


