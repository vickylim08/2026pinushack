import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiService = {
  // Get recommendation
  recommendArtworks: async (userProfile) => {
    const response = await api.post('/ai/recommend', userProfile);
    return response.data;
  },

  // Explain an artwork
  explainArtwork: async (userProfile, artwork) => {
    const response = await api.post('/ai/explain', { userProfile, artwork });
    return response.data;
  },

  // Compare two artworks
  compareArtworks: async (targetId, candidateId) => {
    const response = await api.post('/ai/compare', { targetId, candidateId });
    return response.data;
  },

  // Suggest tags (Text-Only)
  suggestTags: async (payload) => {
    const response = await api.post('/ai/suggest-tags', payload);
    return response.data;
  },

  // Buyer Session (Full Flow)
  startBuyerSession: async (payload) => {
    const response = await api.post('/ai/buyer-session', payload);
    return response.data;
  },

  // TTS Story
  synthesizeStory: async (text, voice = 'en-US-AriaNeural') => {
    const response = await api.post('/tts/story', { text, voice });
    // Returns { audioUrl: "/static/..." }
    // Prepend base url if relative
    if (response.data.audioUrl && response.data.audioUrl.startsWith('/')) {
        response.data.audioUrl = `${API_BASE_URL}${response.data.audioUrl}`;
    }
    return response.data;
  },

  // Upload Image (Local)
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
  }
};

export default api;
