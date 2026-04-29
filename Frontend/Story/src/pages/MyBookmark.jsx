import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoryCard from '../components/StoryCard'

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchBookmarks() {
      const token = localStorage.getItem('access')
      const response = await fetch('http://127.0.0.1:8000/bookmark/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setBookmarks(data)
      console.log(data)
      
      setLoading(false)
    }
    fetchBookmarks()
  }, [])

  async function removeBookmark(id) {
    const token = localStorage.getItem('access')
    await fetch(`http://127.0.0.1:8000/bookmarks/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    // remove from UI instantly
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  if (loading) return <h1 className="text-center mt-10">Loading...</h1>

  // empty state
  if (bookmarks.length === 0) return (
    <div className="text-center mt-20">
      <p className="text-4xl mb-4">🔖</p>
      <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
      <p className="text-gray-500 mb-6">Stories you save will appear here</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Browse stories
      </button>
    </div>
  )

  return (
  <div className="min-h-screen bg-[#0D0B12] text-[#F0EBE0]">

    {/* Header */}
    <div className="flex flex-col items-center py-8">
      <h1 className="text-3xl font-semibold text-[#F0EBE0]">
        My Bookmarks
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        {bookmarks.length} stories saved
      </p>
    </div>

    {/* List */}
    <ul className="list bg-[#161320] rounded-box shadow-md max-w-3xl mx-auto my-4 border border-[#2a2438]">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Your saved stories
      </li>

      {bookmarks.map((item) => (
        <li key={item.id} className="list-row">

          {/* Image */}
          <div>
            <img
              className="size-10 rounded-box object-cover"
              src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            />
          </div>

          {/* Title */}
          <div>
            <div className="text-[#F0EBE0]">
              {item.story.title || 'Untitled'}
            </div>
            <div className="text-xs uppercase font-semibold opacity-60">
              {item.story.language || 'Unknown'}
            </div>
          </div>

          {/* Content */}
          <p className="list-col-wrap text-xs text-gray-400">
            {item.story.content
              ? item.story.content.slice(0, 120) + '...'
              : 'No description'}
          </p>

          {/* Read */}
          <button
            className="btn btn-square btn-ghost text-[#C8A96E]"
            onClick={() => navigate(`/story/${item.story.id}`)}
          >
            ▶
          </button>

          {/* Remove */}
          <button
            className="btn btn-square btn-ghost text-red-400"
            onClick={() => removeBookmark(item.id)}
          >
            ♥
          </button>

        </li>
      ))}
    </ul>

  </div>
)
}