import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import galleryBg from '../assets/gallery_bg.png'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login, signup } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 800))

            let success = false
            if (isLogin) {
                success = login(email, password)
            } else {
                success = signup(name, username, email, password)
            }

            if (success) {
                navigate('/')
            } else {
                setError('Authentication failed. Please try again.')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Animation variants
    const fadeVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
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
            {/* Background with Blur */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${galleryBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(3px)',
                transform: 'scale(1.02)', // Prevent blur edges
                zIndex: -1
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.6)',
                zIndex: -1
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'rgba(25, 25, 25, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2 style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: '2rem',
                            marginBottom: '0.5rem',
                            cursor: 'pointer'
                        }}>
                            MUSE
                        </h2>
                    </Link>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                        {isLogin ? 'Welcome back to the gallery.' : 'Join your artistic journey.'}
                    </p>
                </div>

                {/* Toggle Switch Removed, now just Title */}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                            background: 'rgba(220, 38, 38, 0.2)',
                            border: '1px solid rgba(220, 38, 38, 0.5)',
                            color: '#fca5a5',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                key="name-field"
                                variants={fadeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={labelStyle}>Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={labelStyle}>Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={labelStyle}>{isLogin ? 'Email Address / Username' : 'Email Address'}</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            placeholder={isLogin ? "username or email" : "name@example.com"}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            opacity: loading ? 0.7 : 1,
                            marginBottom: '1.5rem'
                        }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </motion.button>

                    <div style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.8 }}>
                        {isLogin ? "Haven't got an account yet? " : "Already have an account? "}
                        <span
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                color: 'var(--color-secondary)',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontWeight: 600
                            }}
                        >
                            {isLogin ? "Sign Up here" : "Sign In here"}
                        </span>
                    </div>
                </form>

            </motion.div>
        </div>
    )
}

const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
}

const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s'
}
