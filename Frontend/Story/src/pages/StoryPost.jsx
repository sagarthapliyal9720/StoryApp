import React, { useState } from "react";

export default function StoryPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("access");

      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          language,
          genre,
        }),
      });

      if (!response.ok) throw new Error("Story upload failed");

      setMessage("Story created successfully ✓");

      setTitle("");
      setContent("");
      setLanguage("");
      setGenre("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B12] text-[#F0EBE0] flex items-center justify-center p-6">

      {/* CARD */}
      <div className="w-full max-w-2xl bg-[#161320] border border-[#C8A96E22] rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-serif text-center mb-8 text-[#C8A96E]">
          Create New Story ✍️
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-400">Title</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-lg bg-[#0D0B12] border border-gray-700 text-white outline-none focus:border-[#C8A96E]"
              placeholder="Enter story title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="text-sm text-gray-400">Content</label>
            <textarea
              className="w-full mt-1 p-3 h-40 rounded-lg bg-[#0D0B12] border border-gray-700 text-white outline-none focus:border-[#C8A96E]"
              placeholder="Write your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* DROPDOWNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <select
              className="p-3 rounded-lg bg-[#0D0B12] border border-gray-700 text-gray-300 focus:border-[#C8A96E]"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">Language</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
            </select>

            <select
              className="p-3 rounded-lg bg-[#0D0B12] border border-gray-700 text-gray-300 focus:border-[#C8A96E]"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Genre</option>
              <option value="Emotion">Emotion</option>
              <option value="Adventure">Adventure</option>
              <option value="Horror">Horror</option>
              <option value="Funny">Funny</option>
            </select>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#C8A96E] text-black font-medium hover:bg-[#e0c07a] transition"
          >
            {loading ? "Uploading..." : "Create Story"}
          </button>

          {/* MESSAGE */}
          {message && (
            <p className="text-center text-sm text-gray-400 mt-3">
              {message}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}