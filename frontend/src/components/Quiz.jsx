import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const themes = [
  "Abstract", "Surrealism", "Impressionism",
  "Realism", "Cyberpunk", "Minimalist",
  "Nature", "Portrait", "Architecture",
  "Fantasy", "Dark art", "Pop Art"
]

import { useStore } from '../store/useStore'

export default function Quiz() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const setPreferenceTags = useStore((state) => state.setPreferenceTags)

  // Form State
  const [price, setPrice] = useState(5000)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [selectedThemes, setSelectedThemes] = useState([])

  const handleThemeToggle = (theme) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter(t => t !== theme))
    } else {
      setSelectedThemes([...selectedThemes, theme])
    }
  }

  const handleSelectAll = () => {
    if (selectedThemes.length === themes.length) {
      setSelectedThemes([])
    } else {
      setSelectedThemes([...themes])
    }
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Step 2 Validation
      if (selectedThemes.length === 0) {
        alert("Please select at least one theme to proceed.")
        return
      }
      // Save preferences to store (normalize to lowercase)
      setPreferenceTags(selectedThemes.map(t => t.toLowerCase()))
      navigate('/gallery')
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      navigate('/')
    }
  }

  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-text-dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem'
    }}>
      {/* Header Navigation */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        marginBottom: '3rem',
        width: '100%'
      }}>
        <h2 style={{
          padding: '0.6rem 0',
          width: '180px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--color-text-dark)',
          borderRadius: '50px',
          fontFamily: 'var(--font-main)',
          background: 'rgba(255,255,255,0.5)',
          fontSize: '0.9rem',
          margin: 0,
          fontWeight: 400 // Resetting bold if needed, though Navbar uses default
        }}>
          Enter Gallery
        </h2>
        <Link to="/upload" style={{
          padding: '0.6rem 0',
          width: '180px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--color-text-dark)',
          borderRadius: '50px',
          textDecoration: 'none',
          color: 'var(--color-text-dark)',
          fontSize: '0.9rem',
          fontFamily: 'var(--font-main)'
        }}>
          Upload
        </Link>
        {/* Profile button logic would go here if needed, consistent with home */}
      </div>

      {/* Main Form Container */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid var(--color-text-dark)',
        borderRadius: '40px',
        padding: '3rem',
        minHeight: '500px',
        position: 'relative'
      }}>
        <AnimatePresence mode='wait'>
          {step === 1 ? (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '1rem', fontWeight: 500, paddingLeft: '0.5rem' }}>Price</h3>
                <div style={{ position: 'relative', width: '100%', marginBottom: '1rem', height: '2rem' }}>
                  <label
                    style={{
                      fontSize: '1.2rem',
                      fontFamily: 'var(--font-main)',
                      position: 'absolute',
                      left: `${(price / 10000) * 100}%`,
                      transform: 'translateX(-50%)',
                      bottom: 0,
                      whiteSpace: 'nowrap',
                      color: 'var(--color-text-dark)',
                      fontWeight: 600,
                      transition: 'left 0.1s ease-out'
                    }}
                  >
                    ${price}
                  </label>
                </div>

                <div style={{ padding: '0 0.5rem' }}>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: '100%',
                      accentColor: 'var(--color-text-dark)',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 600, opacity: 0.5, fontSize: '0.8rem' }}>
                    <span>$0</span>
                    <span>$10000</span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '2rem',
                marginBottom: 'auto'
              }}>
                {/* Width */}
                <div>
                  <label style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>Width</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      style={inputStyle}
                    />
                    <span style={unitStyle}>cm</span>
                  </div>
                </div>
                {/* Height */}
                <div>
                  <label style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>Height</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      style={inputStyle}
                    />
                    <span style={unitStyle}>cm</span>
                  </div>
                </div>
                {/* Weight */}
                <div>
                  <label style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>Weight</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      style={inputStyle}
                    />
                    <span style={unitStyle}>gram</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-main)' }}>Theme</h2>
                <button
                  onClick={handleSelectAll}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: 'var(--color-text-dark)'
                  }}
                >
                  Select All
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: 'auto'
              }}>
                {themes.map(theme => (
                  <button
                    key={theme}
                    onClick={() => handleThemeToggle(theme)}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '50px',
                      border: `1px solid var(--color-text-dark)`,
                      background: selectedThemes.includes(theme) ? 'var(--color-text-dark)' : 'transparent',
                      color: selectedThemes.includes(theme) ? 'white' : 'var(--color-text-dark)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={handleBack}
            style={navButtonStyle}
          >
            {'< Back'}
          </button>
          <button
            onClick={handleNext}
            style={{
              ...navButtonStyle,
              opacity: (step === 2 && selectedThemes.length === 0) ? 0.5 : 1,
              cursor: (step === 2 && selectedThemes.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            {'Next >'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.8rem',
  paddingRight: '3rem', // space for unit
  borderRadius: '8px',
  border: '1px solid var(--color-text-dark)',
  background: 'transparent',
  fontSize: '1rem',
  color: 'var(--color-text-dark)'
}

const unitStyle = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0.6,
  fontSize: '0.9rem',
  pointerEvents: 'none'
}

const navButtonStyle = {
  padding: '0.8rem 2rem',
  background: 'transparent',
  border: '1px solid var(--color-text-dark)',
  borderRadius: '12px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: 'var(--color-text-dark)',
  fontFamily: 'var(--font-serif)'
}
