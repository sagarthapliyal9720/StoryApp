import { useState } from 'react'

import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
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
function App() {
 

  return (
    <>

   <BrowserRouter>
   <Navbar></Navbar>
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
    <Route path='/register' element={<Sing/>}/>
    <Route
  path="/bookmark"
  element={
    <ProtectedRoute>
      <Bookmark />
    </ProtectedRoute>
  }
/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/story/:id' element={<StoryDetail/> }/>
 <Route path='/trend' element={<Trending/> }/>

    
   </Routes>
    <Footer></Footer>
   </BrowserRouter>
  
    </>
  )
}

export default App
