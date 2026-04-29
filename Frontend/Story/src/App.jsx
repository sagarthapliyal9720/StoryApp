import { useState, useEffect } from 'react'

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import StoryPost from './pages/StoryPost'
import MyStory from './pages/Mystory'
import Trending from './pages/Treding'
import Bookmark from './pages/MyBookmark'
import StoryDetail from './pages/StoryDetail'
import Sing from './pages/Sing'
import BackendLoader from './components/BackendLoader'

function App() {
  const [backendReady, setBackendReady] = useState(false)

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(
          "https://storyapp-38sq.onrender.com/"
        )

        if (response.ok) {
          setBackendReady(true)
        }
      } catch (error) {
        console.log("Backend waking up...")
      }
    }

    // first check immediately
    checkBackend()

    // then check every 5 seconds
    const interval = setInterval(() => {
      checkBackend()
    }, 5000)

    // cleanup
    return () => clearInterval(interval)

  }, [])

  /*
    Show loader until backend is ready
  */
  if (!backendReady) {
    return <BackendLoader />
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>

          <Route
            path="/mystory"
            element={
              <ProtectedRoute>
                <MyStory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <StoryPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookmark"
            element={
              <ProtectedRoute>
                <Bookmark />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register"
            element={<Sing />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/story/:id"
            element={<StoryDetail />}
          />

          <Route
            path="/trend"
            element={<Trending />}
          />

        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App