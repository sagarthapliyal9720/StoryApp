import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const [bookmark, setbookmark] = useState("");

  const handlebookmark = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        `http://127.0.0.1:8000/bookmark/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Bookmark failed");

      setbookmark("Saved ✓");
    } catch (err) {
      setbookmark("Failed ✕");
    }
  };

  const handleListen = () => {
    setAudioLoading(true);
    setAudioUrl(`http://127.0.0.1:8000/listen/${id}/`);
  };

  useEffect(() => {
    async function fetchStory() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/story/${id}/`
        );
        if (!response.ok) throw new Error("Story not found");

        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0B12] text-[#C8A96E]">
        Loading story...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0B12] text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0D0B12] text-[#F0EBE0] px-4 py-10">

      {/* BACK BUTTON */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#C8A96E] hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      {/* CARD */}
      <div className="max-w-4xl mx-auto bg-[#161320] border border-[#C8A96E22] rounded-2xl shadow-lg overflow-hidden">

        {/* IMAGE */}
        <img
          src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
          className="w-full h-72 object-cover"
          alt="story"
        />

        <div className="p-6">

          {/* BADGE */}
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#C8A96E22] text-[#C8A96E] mb-4">
            {story.language}
          </span>

          {/* TITLE */}
          <h1 className="text-3xl font-serif mb-2">
            {story.title}
          </h1>

          {/* META */}
          <div className="text-xs text-gray-400 mb-6 flex gap-2">
            <span>5 min read</span>
            <span>•</span>
            <span>Adventure</span>
          </div>

          {/* CONTENT */}
          <p className="text-gray-300 leading-relaxed mb-8">
            {story.content}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3">

            <button
              onClick={handleListen}
              disabled={audioLoading}
              className="px-4 py-2 rounded-full bg-[#C8A96E] text-black font-medium hover:bg-[#e0c07a] transition"
            >
              {audioLoading ? "Loading..." : "▶ Listen"}
            </button>

            <button
              onClick={handlebookmark}
              className="px-4 py-2 rounded-full border border-[#C8A96E55] text-[#C8A96E] hover:bg-[#C8A96E10]"
            >
              {bookmark || "♡ Save"}
            </button>
          </div>

          {/* LOADING AUDIO */}
          {audioLoading && (
            <p className="text-sm text-gray-400 mt-4">
              Generating audio...
            </p>
          )}

          {/* AUDIO PLAYER */}
          {audioUrl && (
            <div className="mt-6">
              <audio
                controls
                className="w-full rounded-lg"
                onCanPlay={() => setAudioLoading(false)}
              >
                <source src={audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}