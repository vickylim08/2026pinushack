import { create } from 'zustand'

// Initial Mock Data
const INITIAL_ARTWORKS = [
  {
    id: 1,
    url: '/src/assets/textures/art1.png',
    title: 'Chromatic Chaos',
    description: 'An explosion of raw emotion and color.',
    medium: 'Oil on Canvas',
    dimensions: '120x80cm',
    price: '$4,500',
    tags: ['abstract', 'intense'],
    position: [0, 2, -4.9],
    rotation: [0, 0, 0]
  },
  {
    id: 2,
    url: '/src/assets/textures/art2.png',
    title: 'Misty Morning',
    description: 'Silence captured in visual form.',
    medium: 'Digital Print',
    dimensions: '100x100cm',
    price: '$2,200',
    tags: ['realistic', 'calm'],
    position: [-4.9, 2, 0],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    id: 3,
    url: '/src/assets/textures/art3.png',
    title: 'Neon Dreams',
    description: 'The future that never was.',
    medium: '3D Render',
    dimensions: '1920x1080px',
    price: '$3,000',
    tags: ['abstract', 'neon'],
    position: [4.9, 2, 0],
    rotation: [0, -Math.PI / 2, 0]
  },
  {
    id: 4,
    url: '/src/assets/textures/art1.png',
    title: 'Echoes of Color',
    description: 'A variation on the theme reflecting the chaos within.',
    medium: 'Oil on Canvas',
    dimensions: '50x50cm',
    price: '$1,200',
    tags: ['abstract', 'intense'],
    position: [0, 2, 4.9],
    rotation: [0, Math.PI, 0]
  },
]

export const useStore = create((set) => ({
  artworks: INITIAL_ARTWORKS,
  preferences: {
    tags: [], // ['calm', 'abstract']
  },
  favorites: [],
  orders: [],
  currentArtwork: null,

  addOrder: (artwork) => set((state) => ({
    orders: [...state.orders, { ...artwork, orderId: Date.now(), orderDate: new Date().toLocaleDateString() }]
  })),

  setPreferenceTags: (tags) => set((state) => ({
    preferences: { ...state.preferences, tags }
  })),

  addArtwork: (artwork) => set((state) => {
    // Basic slot finding logic (very simple for MVP)
    const existingCount = state.artworks.length;
    // Define a few fixed slots if not provided (just recycling positions for demo)
    const defaultPosition = [0, 2, -4.8 + (existingCount * 0.1)] // Just slight offset to prevent z-fighting if same slot

    // Better: Replace a slot if we are just testing, or append.
    // For this MVP, let's just append and let the user see it if they look closely or we overwrite the last one?
    // Let's actually just PREPEND it so it shows up in the "Main" slot or adjacent.

    const newArt = {
      ...artwork,
      id: Date.now(),
      position: [2, 2, -4.9], // Hardcoded "New Arrival" spot for demo
      rotation: [0, 0, 0],
      isUserUploaded: true
    }

    return { artworks: [...state.artworks, newArt] }
  }),

  toggleFavorite: (id) => set((state) => {
    const isFav = state.favorites.includes(id)
    return {
      favorites: isFav
        ? state.favorites.filter(fid => fid !== id)
        : [...state.favorites, id]
    }
  }),

  setCurrentArtwork: (artwork) => set({ currentArtwork: artwork }),
}))
