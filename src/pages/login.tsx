import React, { useState } from 'react';
import { auth } from '../utils/firebase'; // Make sure this path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in successfully:', user);
      // Redirect or show success message
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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;
