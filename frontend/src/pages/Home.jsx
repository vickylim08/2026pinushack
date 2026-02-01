import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import Quiz from '../components/Quiz'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/useAuthStore'
import { useStore } from '../store/useStore'
import galleryBg from '../assets/gallery_bg.png'

export default function Home() {
  const [started, setStarted] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const artworks = useStore((state) => state.artworks)
  const userUploads = artworks.filter(a => a.isUserUploaded)
  const orders = useStore((state) => state.orders)

  const location = useLocation()
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      // Clear message after 3 seconds
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  if (started && isAuthenticated) {
    return <Quiz />
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      color: 'var(--color-text)'
    }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#4ade80',
              color: '#064e3b',
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Image with Overlay */}
      {/* Background: Image for Guests, Solid Color for Users */}
      {isAuthenticated ? (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--color-text-dark)', // Using the Dark Brown from palette
          zIndex: -1
        }} />
      ) : (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${galleryBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.4)', // Dark overlay
            backdropFilter: 'blur(2px)',
            zIndex: -1
          }} />
        </>
      )}

      {isAuthenticated && <Navbar />}

      {/* Main Content */}
      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          zIndex: 1
        }}
      >
        {isAuthenticated ? (
          <>
            {/* Authenticated Dashboard */}
            <div style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '2rem',
              marginTop: '4rem' // Added margin since buttons are gone
            }}>
              {/* My Uploads Section */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  paddingBottom: '0.5rem',
                  display: 'inline-block',
                  color: 'var(--color-text-dark)'
                }}>
                  My Upload
                </h3>

                {/* Horizontal Scroll Container */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  overflowX: 'auto',
                  padding: '1rem 0',
                  scrollbarWidth: 'none'
                }}>
                  {userUploads.length > 0 ? (
                    userUploads.map((art) => (
                      <div key={art.id} style={{
                        minWidth: '200px',
                        height: '150px',
                        background: `url(${art.url}) center/cover`,
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'start',
                        padding: '1rem',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{art.title}</span>
                      </div>
                    ))
                  ) : (
                    <Link to="/upload" style={{ textDecoration: 'none' }}>
                      <div style={{
                        minWidth: '200px',
                        height: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed var(--color-text-dark)',
                        borderRadius: '12px',
                        opacity: 0.6,
                        cursor: 'pointer',
                        color: 'var(--color-text-dark)',
                        background: 'rgba(0,0,0,0.02)',
                        transition: 'all 0.2s'
                      }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>+ Upload First Work</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* My Order Section */}
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  paddingBottom: '0.5rem',
                  display: 'inline-block',
                  color: 'var(--color-text-dark)'
                }}>
                  My Order
                </h3>

                {/* Horizontal Scroll Container */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  overflowX: 'auto',
                  padding: '1rem 0',
                  scrollbarWidth: 'none'
                }}>
                  {orders.length > 0 ? (
                    orders.map((item) => (
                      <div key={item.orderId} style={{
                        minWidth: '200px',
                        height: '150px',
                        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${item.url}) center/cover`,
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        justifyContent: 'end',
                        padding: '1rem',
                        color: 'white'
                      }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{item.orderDate}</span>
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>{item.title}</span>
                      </div>
                    ))
                  ) : (
                    <div
                      onClick={() => setStarted(true)}
                      style={{
                        minWidth: '200px',
                        height: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed var(--color-text-dark)',
                        borderRadius: '12px',
                        opacity: 0.6,
                        cursor: 'pointer',
                        color: 'var(--color-text-dark)',
                        background: 'rgba(0,0,0,0.02)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>+ Enter Gallery</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: '10vh'
          }}>
            <motion.h1
              variants={fadeInUp}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
                lineHeight: 1.1,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                color: 'white'
              }}
            >
              MUSE.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              style={{
                fontSize: '1.1rem',
                maxWidth: '600px',
                marginBottom: '4rem',
                opacity: 0.9,
                fontWeight: 300,
                lineHeight: 1.6,
                color: 'white'
              }}
            >
              Experience curated exhibitions from the world's most innovative classical and digital artists.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              style={{
                marginTop: '2rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/auth" style={{
                  ...buttonStylePrimary,
                  padding: '1.2rem 4rem',
                  fontSize: '1.1rem'
                }}>
                  Enter Gallery
                </Link>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, maxWidth: '300px', color: 'white' }}>
                  Join our community of artists and collectors. One account for everything.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </motion.main>

      {/* Footer / Copyright */}
      <footer style={{
        padding: '1rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        opacity: 0.5,
        zIndex: 1
      }}>
        © 2026 MUSE VIRTUAL GALLERIES
      </footer>
    </div>
  )
}

// Button Styles
const baseButtonStyle = {
  padding: '1rem 2rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  borderRadius: '50px', // Pill shape
  border: 'none',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  display: 'inline-block'
}

const buttonStylePrimary = {
  ...baseButtonStyle,
  background: 'var(--color-primary)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
}

const buttonStyleSecondary = {
  ...baseButtonStyle,
  background: 'transparent',
  border: '1px solid white',
  color: 'white'
}

const buttonStyleOutline = {
  ...baseButtonStyle,
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.3)',
  color: 'white'
}
