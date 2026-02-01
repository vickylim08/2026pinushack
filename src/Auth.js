import React, { useState, useEffect } from 'react';
import { supabase } from './supabase-config';

const Auth = () => {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        // This function correctly fetches the initial session.
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };

        getInitialSession();

        // This listener will update the session state when the user logs in or out.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // This will clean up the listener when the component is unmounted.
        return () => subscription.unsubscribe();
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setStatus(`Error signing up: ${error.message}`);
        } else {
            setStatus('Sign up successful! Please check your email for a confirmation link.');
        }
        setLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setStatus(`Error logging in: ${error.message}`);
        }
        // onAuthStateChange will handle setting the session
        setLoading(false);
    };

    const handleSignOut = async () => {
        setLoading(true);
        setStatus('');
        const { error } = await supabase.auth.signOut();
        if (error) {
            setStatus(`Error signing out: ${error.message}`);
        }
        // onAuthStateChange will handle setting the session to null
        setLoading(false);
    };

    // Basic styling
    const containerStyle = { border: '1px solid #ccc', padding: '1em', borderRadius: '8px', marginBottom: '2em' };
    const inputStyle = { width: '100%', padding: '0.8em', boxSizing: 'border-box', marginBottom: '1em' };
    const buttonStyle = { padding: '0.8em 1.2em', marginRight: '1em', cursor: 'pointer' };

    if (session) {
        return (
            <div style={containerStyle}>
                <p>Logged in as: <strong>{session.user.email}</strong></p>
                <button style={buttonStyle} onClick={handleSignOut} disabled={loading}>
                    {loading ? 'Signing out...' : 'Sign Out'}
                </button>
                {status && <p>{status}</p>}
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2>Login / Sign Up</h2>
            <form>
                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div>
                    <button style={buttonStyle} onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <button style={buttonStyle} onClick={handleSignUp} disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </div>
            </form>
            {status && <p style={{ marginTop: '1em' }}>{status}</p>}
        </div>
    );
};

export default Auth;
