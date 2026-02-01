import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'

export default function Navbar() {
    const { user } = useAuthStore()

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 100,
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 3rem',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                {/* Left: Logo */}
                <div style={{ flex: 1 }}>
                    <Link to="/" style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '1.5rem',
                        textDecoration: 'none',
                        color: 'white',
                        letterSpacing: '0.1em',
                        fontWeight: 600
                    }}>
                        MUSE
                    </Link>
                </div>

                {/* Center: Navigation Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flex: 2 }}>
                    <Link to="/preference" style={{
                        padding: '0.6rem 0', // Removed horizontal padding, using width
                        width: '180px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid white',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Enter Gallery
                    </Link>
                    <Link to="/upload" style={{
                        padding: '0.6rem 0',
                        width: '180px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid white',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Upload
                    </Link>
                </div>

                {/* Right: Profile Icon */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/profile" style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1.2rem',
                        fontFamily: 'Cinzel, serif',
                        backdropFilter: 'blur(5px)'
                    }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Link>
                </div>
            </div>
        </motion.nav>
    )
}
