import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import GalleryScene from '../canvas/GalleryScene'
import { useStore } from '../store/useStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Gallery() {
    const currentArtwork = useStore((state) => state.currentArtwork)
    const setCurrentArtwork = useStore((state) => state.setCurrentArtwork)
    const favorites = useStore((state) => state.favorites)
    const orders = useStore((state) => state.orders)
    const addOrder = useStore((state) => state.addOrder)
    const navigate = useNavigate()

    const isPurchased = currentArtwork && orders.some(o => o.id === currentArtwork.id)

    const getAIExplanation = (art) => {
        if (!art) return "Welcome to the Victorian Wing. I am your AI Curator. Select any artwork to learn about its soul and secrets."
        return `${art.title} is a remarkable example of ${art.medium}. Our AI analysis suggests it embodies the transition from classical structure to modern chaos. The usage of ${art.tags?.[0] || 'vibrant'} tones indicates a deep emotional resonance typical of the late 19th-century avant-garde.`
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#fcfcfc', position: 'relative' }}>
            <Canvas camera={{ position: [0, 4.5, 0.1], fov: 60 }} shadows>
                <Suspense fallback={null}>
                    <GalleryScene />
                </Suspense>
            </Canvas>

            {/* Back Button */}
            <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 10 }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        color: 'rgba(0,0,0,0.7)',
                        background: 'transparent',
                        border: '1px solid rgba(0,0,0,0.2)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        cursor: 'pointer'
                    }}
                >
                    Termination
                </button>
            </div>

            {/* Modal */}
            <AnimatePresence mode="wait">
                {currentArtwork && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120,
                            backdropFilter: 'blur(8px)'
                        }}
                        onClick={() => setCurrentArtwork(null)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            style={{
                                background: 'white',
                                borderRadius: '4px',
                                maxWidth: '1000px',
                                width: '90%',
                                display: 'flex',
                                flexDirection: 'row',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                                overflow: 'hidden'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* LEFT: Artwork Image (ALONE - No Overlap) */}
                            <div style={{
                                width: '50%',
                                background: `#111 url(${currentArtwork.url}) center/contain no-repeat`,
                                minHeight: '600px'
                            }}>
                                {/* Purely the artwork image as requested */}
                            </div>

                            {/* RIGHT: Info column */}
                            <div style={{ width: '50%', padding: '50px', display: 'flex', flexDirection: 'column', color: 'black' }}>
                                <h1 style={{ fontSize: '2.4rem', fontFamily: 'serif', margin: '0 0 10px 0' }}>{currentArtwork.title}</h1>

                                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '0.9rem', opacity: 0.6 }}>
                                    <span>{currentArtwork.medium}</span>
                                    <span>•</span>
                                    <span>{currentArtwork.dimensions}</span>
                                    <span>•</span>
                                    <span style={{ fontWeight: 'bold', color: '#98843E' }}>{currentArtwork.price}</span>
                                </div>

                                <p style={{ fontSize: '1rem', lineHeight: 1.7, opacity: 0.8, marginBottom: '30px', flex: 1 }}>
                                    {currentArtwork.description}
                                </p>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                    <button
                                        disabled={isPurchased}
                                        onClick={(e) => { e.stopPropagation(); addOrder(currentArtwork); }}
                                        style={{
                                            flex: 2,
                                            background: isPurchased ? '#4ade80' : '#111',
                                            color: 'white',
                                            border: 'none',
                                            padding: '16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {isPurchased ? '✓ Purchased' : 'Buy Artwork'}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); useStore.getState().toggleFavorite(currentArtwork.id); }}
                                        style={{
                                            flex: 1,
                                            background: favorites.includes(currentArtwork.id) ? '#d4af37' : '#eee',
                                            color: favorites.includes(currentArtwork.id) ? 'white' : 'black',
                                            border: 'none',
                                            padding: '16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {favorites.includes(currentArtwork.id) ? 'Saved' : 'Save'}
                                    </button>
                                </div>

                                {/* AI BUDDY BOX (BELOW BUTTONS) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        padding: '20px',
                                        background: 'rgba(152, 132, 62, 0.08)',
                                        border: '1px solid rgba(152, 132, 62, 0.3)',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <div style={{ background: '#98843E', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' }}>AI CURATOR</div>
                                        <div style={{ height: '1px', flex: 1, background: 'rgba(152, 132, 62, 0.2)' }} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic', color: 'rgba(0,0,0,0.8)' }}>
                                        "{getAIExplanation(currentArtwork)}"
                                    </p>
                                </motion.div>

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <button
                                        onClick={() => setCurrentArtwork(null)}
                                        style={{ background: 'transparent', color: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer', fontSize: '0.7rem', textTransform: 'uppercase' }}
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Helper */}
            <div style={{ position: 'absolute', bottom: '30px', width: '100%', textAlign: 'center', color: 'rgba(0,0,0,0.4)', pointerEvents: 'none', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                WASD to Move • Click to Explore
            </div>
        </div>
    )
}
