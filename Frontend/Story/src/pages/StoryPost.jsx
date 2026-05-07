import React, { useState } from "react";

export default function StoryPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success / error

  // Match with Backend GENRE_CONFIG
  const genres = [
    { value: "adventure", label: "Adventure" },
    { value: "horror", label: "Horror" },
    { value: "romantic", label: "Romantic" },
    { value: "funny", label: "Funny" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !language || !genre) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Creating story... Audio is being generated in background");
    setMessageType("info");

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        "https://storyapp-38sq.onrender.com/upload/",
        {
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
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Story created successfully! Audio is being generated...");
        setMessageType("success");

        // Reset form
        setTitle("");
        setContent("");
        setLanguage("");
        setGenre("");
      } else {
        setMessage(data.error || data.message || "Failed to create story");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B12] text-[#F0EBE0] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#161320] border border-[#C8A96E22] rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-serif text-center mb-8 text-[#C8A96E]">
          Create New Story ✍️
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Title</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#0D0B12] border border-gray-700 focus:border-[#C8A96E] outline-none"
              placeholder="Enter a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Story Content</label>
            <textarea
              className="w-full p-3 h-48 rounded-lg bg-[#0D0B12] border border-gray-700 focus:border-[#C8A96E] outline-none resize-y"
              placeholder="Write your story here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Language & Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Language</label>
              <select
                className="w-full p-3 rounded-lg bg-[#0D0B12] border border-gray-700 focus:border-[#C8A96E] outline-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select Language</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Genre</label>
              <select
                className="w-full p-3 rounded-lg bg-[#0D0B12] border border-gray-700 focus:border-[#C8A96E] outline-none"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select Genre</option>
                {genres.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#C8A96E] text-black font-semibold text-lg hover:bg-[#e0c07a] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Story & Generating Audio..." : "Create Story"}
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center text-sm mt-3 font-medium ${
                messageType === "success"
                  ? "text-green-400"
                  : messageType === "error"
                  ? "text-red-400"
                  : "text-yellow-300"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}