import React, { useEffect, useState } from "react";
import StoryCard from "../components/StoryCard";

export default function Trending() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

async function FetchTrendingStory() {
  try {
    setLoading(true);

    const token = localStorage.getItem("access");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("https://storyapp-38sq.onrender.com/trending/", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("API failed");
    }

    const story = await response.json();
    setData(story);
    setError("");
  } catch (error) {
    console.log(error);
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    FetchTrendingStory();
  }, []);

  /* ── loader ── */
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "#C8A96E", fontSize: "14px" }}>
        Loading trending stories…
      </div>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "#E06B6B", fontSize: "14px" }}>
        {error}
      </div>
    );
  }

  /* ── empty ── */
  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "#8A8499", fontSize: "14px" }}>
        No trending stories yet.
      </div>
    );
  }

  return (
    <>
      <style>{`
        .k-trend-scroll {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .k-trend-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Horizontal scroll row — same pattern as recommended */}
      <div className="k-trend-scroll">
        {data.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </>
  );
}
