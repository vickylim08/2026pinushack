import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import galleryBg from '../assets/gallery_bg.png'

export default function ChangePassword() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords don't match")
            return
        }

        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters")
            return
        }

        // Simulate success
        setSuccess("Password updated successfully")
        setTimeout(() => navigate('/profile'), 1500)
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            color: 'white'
        }}>
            {/* Background (Reuse Auth Style) */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${galleryBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(3px)', transform: 'scale(1.02)', zIndex: -1
            }} />
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.6)', zIndex: -1
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%', maxWidth: '420px',
                    background: 'rgba(25, 25, 25, 0.7)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px',
                    padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem' }}>Change Password</h2>

                {error && <div style={{ color: '#fca5a5', background: 'rgba(220, 38, 38, 0.2)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: '#86efac', background: 'rgba(22, 163, 74, 0.2)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={labelStyle}>Current Password</label>
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={labelStyle}>New Password</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={labelStyle}>Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/profile')} style={{ ...buttonStyle, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}>Cancel</button>
                        <button type="submit" style={{ ...buttonStyle, background: 'var(--color-primary)' }}>Update</button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { width: '100%', padding: '0.8rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' }
const buttonStyle = { flex: 1, padding: '1rem', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }
