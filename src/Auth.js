import React, { useState, useEffect } from 'react';
import { supabase } from './supabase-config';

const Auth = () => {
    const [session, setSession] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false); // To toggle between modes
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleSignUp = async () => {
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    username: username,
                }
            }
        });
        if (error) {
            setStatus(`Error signing up: ${error.message}`);
        } else {
            setStatus('Sign up successful! You can now log in.');
            // (If you re-enable email confirmation, change this message)
        }
    };

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setStatus(`Error logging in: ${error.message}`);
        }
        // onAuthStateChange will handle setting the session
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        if (isSignUp) {
            await handleSignUp();
        } else {
            await handleLogin();
        }
        setLoading(false);
    };

    const handleSignOut = async () => {
        setLoading(true);
        setStatus('');
        await supabase.auth.signOut();
        setLoading(false);
    };

    // --- Styling ---
    const containerStyle = { border: '1px solid #ccc', padding: '1.5em', borderRadius: '8px', marginBottom: '2em' };
    const inputStyle = { width: '100%', padding: '0.8em', boxSizing: 'border-box', marginBottom: '1em' };
    const buttonStyle = { width: '100%', padding: '1em', cursor: 'pointer', fontWeight: 'bold' };
    const toggleStyle = { marginTop: '1em', textAlign: 'center', cursor: 'pointer', color: 'blue', textDecoration: 'underline' };

    if (session) {
        return (
            <div style={containerStyle}>
                <p>Logged in as: <strong>{session.user.email}</strong></p>
                <p>Full Name: <strong>{session.user.user_metadata?.full_name || 'Not set'}</strong></p>
                <p>Username: <strong>{session.user.user_metadata?.username || 'Not set'}</strong></p>
                <button style={{...buttonStyle, background: '#eee'}} onClick={handleSignOut} disabled={loading}>
                    {loading ? 'Signing out...' : 'Sign Out'}
                </button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2>{isSignUp ? 'Create a New Account' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <>
                        <input style={inputStyle} type="text" placeholder="Your Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        <input style={inputStyle} type="text" placeholder="Your Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </>
                )}
                <input style={inputStyle} type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input style={inputStyle} type="password" placeholder="Your password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button style={buttonStyle} type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
                </button>
            </form>
            <p style={toggleStyle} onClick={() => { setIsSignUp(!isSignUp); setStatus(''); }}>
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </p>
            {status && <p style={{ marginTop: '1em' }}>{status}</p>}
        </div>
    );
};

export default Auth;
