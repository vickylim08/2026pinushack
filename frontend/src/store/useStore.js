import { create } from 'zustand'
import { db } from '../firebase-config'
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'

export const useStore = create((set) => ({
  artworks: [],
  preferences: {
    tags: [],
  },
  favorites: [],
  orders: [],
  currentArtwork: null,
  loading: true,

  // Real-time subscription to Firestore
  fetchArtworks: () => {
    const q = query(collection(db, "artworks"), orderBy("id", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arts = [];
        querySnapshot.forEach((doc) => {
            arts.push({ ...doc.data(), firestoreId: doc.id });
        });
        set({ artworks: arts, loading: false });
    });
    return unsubscribe;
  },

  addOrder: (artwork) => set((state) => ({
    orders: [...state.orders, { ...artwork, orderId: Date.now(), orderDate: new Date().toLocaleDateString() }]
  })),

  setPreferenceTags: (tags) => set((state) => ({
    preferences: { ...state.preferences, tags }
  })),

  // Save to Firestore
  addArtwork: async (artwork) => {
    try {
        // We use the same position logic or randomize it for now
        const newArt = {
            ...artwork,
            id: Date.now(), // Keep numeric ID for existing logic, or use firestore ID
            position: [Math.random() * 4 - 2, 2, Math.random() * 4 - 2], // Random spot for now
            rotation: [0, Math.random() * Math.PI, 0],
            isUserUploaded: true,
            createdAt: new Date().toISOString()
        }
        await addDoc(collection(db, "artworks"), newArt);
        // No need to set state manually, onSnapshot will pick it up
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Failed to save artwork to cloud.");
    }
  },

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
