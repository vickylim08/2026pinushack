import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Gallery from './pages/Gallery.jsx'
import Upload from './pages/Upload.jsx'
import Auth from './pages/Auth.jsx'
import Profile from './pages/Profile.jsx'
import Quiz from './components/Quiz.jsx'
import EditProfile from './pages/EditProfile.jsx' // Added this import

import { useEffect } from 'react'
import { useStore } from './store/useStore'

function App() {
  const fetchArtworks = useStore((state) => state.fetchArtworks)

  useEffect(() => {
    const unsubscribe = fetchArtworks()
    return () => unsubscribe()
  }, [fetchArtworks])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/preference" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
