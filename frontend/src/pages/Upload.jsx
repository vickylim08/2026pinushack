import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { motion } from 'framer-motion'
import { aiService } from '../services/api' // Import AI Service
import { storage, auth } from '../firebase-config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { signInAnonymously } from 'firebase/auth'
import { useEffect } from 'react'

export default function Upload() {
  const navigate = useNavigate()
  const addArtwork = useStore((state) => state.addArtwork)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    dimensions: '', // kept for compatibility if needed, but we compose it
    width: '',
    height: '',
    weight: '',
    year: '',
    price: '',
    tags: 'abstract', // Keeping single select for now as per previous, but labeled 'tags'
    image: null
  })
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null) // PRESERVE THE RAW FILE FOR UPLOAD

  useEffect(() => {
    signInAnonymously(auth).catch((error) => console.error("Auth Error:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'image/png') {
        alert('Please upload a PNG file.')
        return
      }
      const url = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, image: url })) // Keep for preview
      setPreview(url)
      setFile(file) // Storing the actual file
    }
  }

  const [aiStatus, setAiStatus] = useState('')

  const handleSuggestTags = async () => {
    if (!formData.title && !formData.description && !formData.medium) {
        alert("Please fill in Title, Description, or Medium first!")
        return
    }
    setAiStatus('thinking')
    try {
        const payload = {
            title: formData.title,
            story: formData.description || "", // Default to empty string
            medium: formData.medium || "Unknown", // Default to Unknown to avoid null
            year: formData.year ? parseInt(formData.year) : 2024,
            size: { 
                width: formData.width ? parseInt(formData.width) : 0, 
                height: formData.height ? parseInt(formData.height) : 0, 
                unit: 'cm' 
            }
        }
        console.log("Sending Payload:", payload); // Debug log
        const result = await aiService.suggestTags(payload)
        
        // Collect all tags
        const allTags = [
            ...(result.style || []),
            ...(result.mood || []),
            ...(result.themes || []),
            ...(result.colors || [])
        ]
        
        // Update tags field (comma separated)
        setFormData(prev => ({ ...prev, tags: allTags.join(', ') }))
        setAiStatus('done')
    } catch (error) {
        console.error("AI Error:", error)
        setAiStatus('error')
    }
  }

  const handleInputKeyDown = (e, isNumeric = false) => {
    // Block invalid chars for numeric inputs
    if (isNumeric && ['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault()
      return
    }

    // Handle Enter key navigation
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent default form submit
      const form = e.target.form
      const index = Array.prototype.indexOf.call(form, e.target)

      // Find next interactive element
      let nextIndex = index + 1
      while (form.elements[nextIndex]) {
        const next = form.elements[nextIndex]
        // Skip hidden inputs or unchecked radios if any (not case here but good practice)
        // Just focus the next one
        if (!next.disabled && next.tabIndex !== -1) {
          next.focus()
          break
        }
        nextIndex++
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Status indicator (rudimentary)
    const btn = e.target.querySelector('button[type="submit"]')
    if(btn) btn.innerText = "Uploading..."

    // Add default mock image if none selected for easier testing
    let finalImage = formData.image || 'https://via.placeholder.com/500' // rudimentary fallback

    // UPLOAD TO LOCAL BACKEND (Bypass Google Cloud CORS)
    if (file) {
        try {
            // Upload to Python Backend
            finalImage = await aiService.uploadImage(file);
            console.log("Uploaded Image URL:", finalImage);
        } catch (err) {
            console.error("Upload Failed", err);
            alert("Image upload failed, using placeholder.");
        }
    }

    // Format price and dimensions
    const finalPrice = formData.price.startsWith('$') ? formData.price : `$${formData.price}`
    const finalDimensions = (formData.width && formData.height)
      ? `${formData.width}x${formData.height}cm`
      : formData.dimensions || 'Unknown'

    // Save to Firestore via Store
    await addArtwork({
      title: formData.title,
      description: formData.description,
      medium: formData.medium,
      dimensions: finalDimensions, // Size
      weight: `${formData.weight}g`,
      year: formData.year,
      price: finalPrice,
      tags: [formData.tags], // simple single tag for now
      url: finalImage,
      ...formData // Pass other fields like weight/year if store accepts spread
    })

    navigate('/', { state: { message: 'Artwork uploaded successfully!' } })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-text-dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '600px', position: 'relative' }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-dark)',
            fontSize: '1rem',
            fontFamily: 'var(--font-main)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = 1}
          onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
        >
          ← Back
        </button>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '2rem',
          fontWeight: 300,
          fontFamily: 'var(--font-serif)',
          textAlign: 'center',
          marginTop: '3rem' // Added margin to clear back button
        }}>
          Upload Artwork
        </h1>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'rgba(255,255,255,0.85)',
          padding: '3rem',
          borderRadius: '40px',
          border: '1px solid var(--color-text-dark)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Artwork Title</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              onKeyDown={(e) => handleInputKeyDown(e)}
              style={inputStyle}
              placeholder="e.g. The Void"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              onKeyDown={(e) => handleInputKeyDown(e)}
              rows={4}
              style={{ ...inputStyle, fontFamily: 'inherit' }}
              placeholder="Tell the story..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Price ($)</label>
              <input
                required
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                onKeyDown={(e) => handleInputKeyDown(e, true)}
                style={inputStyle}
                placeholder="1000"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Year</label>
              <input
                required
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                onKeyDown={(e) => handleInputKeyDown(e, true)}
                style={inputStyle}
                placeholder="2024"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Width (cm)</label>
              <input
                required
                name="width"
                type="number"
                value={formData.width}
                onChange={handleChange}
                onKeyDown={(e) => handleInputKeyDown(e, true)}
                style={inputStyle}
                placeholder="50"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Height (cm)</label>
              <input
                required
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                onKeyDown={(e) => handleInputKeyDown(e, true)}
                style={inputStyle}
                placeholder="50"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Weight (g)</label>
              <input
                required
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                onKeyDown={(e) => handleInputKeyDown(e, true)}
                style={inputStyle}
                placeholder="500"
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Medium</label>
            <input
              required
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              onKeyDown={(e) => handleInputKeyDown(e)}
              style={inputStyle}
              placeholder="Oil, Digital, etc."
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Tags (AI Suggested)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  required
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  onKeyDown={(e) => handleInputKeyDown(e)}
                  style={inputStyle}
                  placeholder="Abstract, Calm, Blue..."
                />
                <button 
                    type="button" 
                    onClick={handleSuggestTags}
                    disabled={aiStatus === 'thinking'}
                    style={{
                        padding: '0 1.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--color-text-dark)',
                        background: aiStatus === 'thinking' ? '#ccc' : 'transparent',
                        cursor: aiStatus === 'thinking' ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {aiStatus === 'thinking' ? 'Thinking...' : '✨ Auto-Tag'}
                </button>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Upload Image (PNG only)</label>
            <input
              required
              type="file"
              accept="image/png"
              onChange={handleImageChange}
              onKeyDown={(e) => handleInputKeyDown(e)}
              style={{ ...inputStyle, padding: '0.8rem', cursor: 'pointer' }}
            />
          </div>

          {preview && (
            <div style={{ width: '100%', height: '200px', background: `url(${preview}) center/cover`, borderRadius: '12px', opacity: 0.9, border: '1px solid var(--color-text-dark)' }}></div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '1.2rem',
              background: 'var(--color-text-dark)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Publish to Gallery
          </button>

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
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: 'var(--color-text-dark)',
  fontFamily: 'var(--font-main)'
}

const inputStyle = {
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid var(--color-text-dark)',
  background: 'transparent',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
  color: 'var(--color-text-dark)',
  fontFamily: 'inherit'
}
