import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/useAuthStore'

export default function EditProfile() {
    const { user, isAuthenticated, updateProfile } = useAuthStore()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: ''
    })

    const [status, setStatus] = useState('')

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || user.name || '',
                username: user.username || '',
                email: user.email || ''
            })
        }
    }, [user])

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
                    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '3rem', marginBottom: '1rem' }}>Auth Required</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
                        To edit your artist profile and collection details, please join the gallery first.
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setStatus('saving')

        // Simulate a small delay for premium feel
        setTimeout(() => {
            updateProfile(formData)
            setStatus('saved')
            setTimeout(() => navigate('/profile'), 1000)
        }, 800)
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg)',
            color: 'var(--color-text-dark)',
            paddingTop: '100px'
        }}>
            <Navbar />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    padding: '3rem',
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '40px',
                    border: '1px solid var(--color-text-dark)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '2.5rem',
                        margin: 0,
                    }}>
                        Edit Profile
                    </h1>
                    <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Update your personal gallery identity</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>@</span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                style={{ ...inputStyle, paddingLeft: '2.2rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={status === 'saving'}
                            style={{
                                ...actionButtonStyle,
                                flex: 1,
                                opacity: status === 'saving' ? 0.7 : 1
                            }}
                        >
                            {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            style={{
                                ...actionButtonStyle,
                                flex: 1,
                                background: 'transparent',
                                color: 'var(--color-text-dark)',
                                border: '1px solid var(--color-text-dark)'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
}

const labelStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 700,
    opacity: 0.8
}

const inputStyle = {
    padding: '1.2rem',
    background: 'white',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '15px',
    fontSize: '1rem',
    fontFamily: 'var(--font-main)',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none'
}

const actionButtonStyle = {
    padding: '1.2rem',
    background: 'var(--color-text-dark)',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
    transition: 'all 0.2s'
}
