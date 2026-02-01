import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/useAuthStore'

export default function Profile() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg)',
                color: 'var(--color-text-dark)',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <Navbar />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '3rem', marginBottom: '1rem' }}>Access Restricted</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
                        To view and manage your private art collection and profile details, please enter your credentials.
                    </p>
                    <button
                        onClick={() => navigate('/auth')}
                        style={actionButtonStyle}
                    >
                        Login / Register
                    </button>
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-dark)', textDecoration: 'underline', cursor: 'pointer', opacity: 0.5 }}
                        >
                            Back to Home
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg)',
            color: 'var(--color-text-dark)',
            paddingTop: '100px' // Space for fixed navbar
        }}>
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '3rem',
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: '40px',
                    border: '1px solid var(--color-text-dark)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '2rem' }}>
                    <h1 style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '3rem',
                        margin: 0,
                    }}>
                        User Profile
                    </h1>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
                    gap: '4rem',
                    alignItems: 'start'
                }}>
                    <div style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'var(--color-text-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                        fontFamily: "'Cinzel', serif",
                        color: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <label style={labelStyle}>Name</label>
                            <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>{user?.fullName || user?.name || 'Artist Name'}</p>
                        </div>

                        <div>
                            <label style={labelStyle}>Username</label>
                            <p style={{ fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 500 }}>@{user?.username || 'username'}</p>
                        </div>

                        <div>
                            <label style={labelStyle}>Email</label>
                            <p style={{ fontSize: '1.2rem', fontFamily: 'monospace', opacity: 0.8 }}>{user?.email}</p>
                        </div>

                        <div>
                            <label style={labelStyle}>Password</label>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '1.5rem', letterSpacing: '3px' }}>••••••••</p>
                                <button
                                    onClick={() => navigate('/change-password')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--color-primary)',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-main)'
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => navigate('/edit-profile')}
                                style={actionButtonStyle}
                            >
                                Edit Profile
                            </button>
                            <button onClick={handleLogout} style={{ ...actionButtonStyle, background: 'transparent', color: 'var(--color-text-dark)', border: '1px solid var(--color-text-dark)' }}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
    color: 'var(--color-text-dark)',
    opacity: 0.6
}

const actionButtonStyle = {
    padding: '1rem 2.5rem',
    background: 'var(--color-text-dark)',
    border: '1px solid var(--color-text-dark)',
    color: 'white',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.2s',
    fontWeight: 600
}
