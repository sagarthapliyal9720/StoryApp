import React, { useEffect, useState } from "react";
import StoryCard from "../components/StoryCard";
import Trending from "./Treding";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [stories, setStories] = useState([]);
  const [recommendedStories, setRecommendedStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  async function Storydata() {
    try {
      setLoading(true);

      let url = `http://127.0.0.1:8000/?`;

      if (searchTerm) url += `search=${searchTerm}&`;
      if (language) url += `language=${language}&`;
      if (genre) url += `genre=${genre}&`;

      const token = localStorage.getItem("access");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(url, { method: "GET", headers });

      if (!response.ok) throw new Error("API not working");

      const data = await response.json();
      setStories(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecommendations() {
    try {
      setRecommendLoading(true);

      const token = localStorage.getItem("access");
      if (!token) return setRecommendedStories([]);

      const res = await fetch("http://127.0.0.1:8000/rec/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return setRecommendedStories([]);

      const data = await res.json();
      setRecommendedStories(data.recommended_stories);
    } catch {
      setRecommendedStories([]);
    } finally {
      setRecommendLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      Storydata();
      if (isLoggedIn) fetchRecommendations();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, language, genre]);

  const genres = ["Adventure", "Horror", "Fantasy", "Moral"];
  const languages = ["hindi", "english"];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0B12] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0B12] text-[#F0EBE0] font-sans">

      {/* HERO */}
      <div className="text-center py-16 px-4 relative">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">
          Where <span className="text-yellow-400 italic">stories</span> come alive
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Listen, read and discover handcrafted tales in Hindi and English
        </p>

        {/* SEARCH */}
        <div className="flex max-w-xl mx-auto bg-[#161320] border border-yellow-700/20 rounded-full overflow-hidden">
          <input
            className="flex-1 bg-transparent px-5 py-3 outline-none"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-yellow-500 text-black px-6">
            Search
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-2 px-4 mb-8">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(genre === g ? "" : g)}
            className={`px-4 py-1 rounded-full border text-sm transition
              ${genre === g
                ? "bg-yellow-500 text-black"
                : "border-yellow-700/30 text-gray-400"
              }`}
          >
            {g}
          </button>
        ))}

        {languages.map((l) => (
          <button
            key={l}
            onClick={() => setLanguage(language === l ? "" : l)}
            className={`px-4 py-1 rounded-full border text-sm transition
              ${language === l
                ? "bg-yellow-500 text-black"
                : "border-yellow-700/30 text-gray-400"
              }`}
          >
            {l}
          </button>
        ))}

        <button
          onClick={() => {
            setSearchTerm("");
            setGenre("");
            setLanguage("");
          }}
          className="px-4 py-1 text-red-400"
        >
          Reset
        </button>
      </div>

      {/* RECOMMENDATION */}
      {isLoggedIn ? (
        recommendedStories.length > 0 && (
          <div className="bg-[#161320] py-8 border-y border-yellow-700/10">
            <div className="max-w-6xl mx-auto px-4">

              <h2 className="text-xl font-serif mb-4">
                🎯 Recommended for you
              </h2>

              {recommendLoading ? (
                <p className="text-yellow-400">Loading...</p>
              ) : (
                <div className="flex gap-4 overflow-x-auto">
                  {recommendedStories.map((s) => (
                    <StoryCard key={s.id} story={s} />
                  ))}
                </div>
              )}

            </div>
          </div>
        )
      ) : (
        <div className="text-center py-10 bg-[#161320] border-y border-yellow-700/10">
          <p className="text-gray-400 mb-4">
            Login to get personalized recommendations
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-500 text-black px-6 py-2 rounded-full"
          >
            Login
          </button>
        </div>
      )}

      {/* TRENDING */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-serif mb-4">🔥 Trending Stories</h2>
        <div className="bg-[#161320] p-4 rounded-xl">
          <Trending />
        </div>
      </div>

      {/* ALL STORIES */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-serif mb-4">
          ✨ All Stories ({stories.length})
        </h2>

        {loading ? (
          <p className="text-yellow-400">Loading...</p>
        ) : stories.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No stories found</p>
        )}
      </div>

    </div>
  );
}