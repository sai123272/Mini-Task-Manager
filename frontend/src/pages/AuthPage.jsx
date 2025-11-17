import React, { useState } from 'react';
import { auth, saveToken } from '../api';

export default function AuthPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (isSignup) {
        await auth.signup(username, password);
      }
      const res = await auth.login(username, password);
      saveToken(res.token);
      onLogin();
    } catch (err) {
      setError(err.data?.error || 'Request failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="container">
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={submit} className="card">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}</button>
        <p className="muted">{error}</p>
      </form>
      <button onClick={()=>setIsSignup(!isSignup)} className="link">{isSignup ? 'Have an account? Log in' : 'Create an account'}</button>
    </div>
  );
}
