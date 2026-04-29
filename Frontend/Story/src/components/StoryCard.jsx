import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StoryCard({ story }) {
  const navigate = useNavigate();

  // backend se aane wala initial state
  const [liked, setLiked] = useState(story.is_liked || false);
  const [likeCount, setLikeCount] = useState(story.like_count || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      if (loading) return;

      const token = localStorage.getItem("access");

      if (!token) {
        alert("Please login first");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `http://127.0.0.1:8000/like/${story.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Like failed");
      }

      // UI instantly update
      if (!liked) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* genre → emoji cover mapping */
  const coverEmoji = {
    Adventure: { emoji: "⚔️", bg: "linear-gradient(135deg, #1E2A4A 0%, #2D3F6E 100%)" },
    Horror:    { emoji: "🕯️", bg: "linear-gradient(135deg, #1E1226 0%, #341640 100%)" },
    Fantasy:   { emoji: "🌙", bg: "linear-gradient(135deg, #12291E 0%, #1E4030 100%)" },
    Moral:     { emoji: "🌱", bg: "linear-gradient(135deg, #2A1C10 0%, #4A3218 100%)" },
  };
  const cover = coverEmoji[story.genre] || { emoji: "📖", bg: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)" };

  return (
    <>
      <style>{`
        .k-card {
          width: 230px;
          flex-shrink: 0;
          background: #161320;
          border: 0.5px solid rgba(200,169,110,0.15);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }
        .k-card:hover {
          transform: translateY(-3px);
          border-color: rgba(200,169,110,0.4);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .k-card-cover {
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 46px;
        }
        .k-card-body {
          padding: 14px 16px 16px;
        }
        .k-card-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .k-tag {
          font-size: 10px;
          padding: 3px 10px;
          border-radius: 10px;
          font-weight: 500;
          text-transform: capitalize;
        }
        .k-tag-lang {
          background: rgba(123,94,167,0.2);
          color: #B49BD4;
        }
        .k-tag-genre {
          background: rgba(200,169,110,0.15);
          color: #C8A96E;
        }
        .k-card-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.45;
          margin-bottom: 6px;
          color: #F0EBE0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .k-card-preview {
          font-size: 12px;
          color: #8A8499;
          line-height: 1.65;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .k-card-author {
          font-size: 11px;
          color: #5F5E70;
          margin-bottom: 14px;
        }
        .k-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 0.5px solid rgba(200,169,110,0.1);
        }
        .k-read-btn {
          font-size: 12px;
          font-weight: 500;
          color: #C8A96E;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: color 0.2s;
        }
        .k-read-btn:hover { color: #E8C98A; }

        .k-like-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 20px;
          border: 0.5px solid rgba(200,169,110,0.18);
          background: transparent;
          color: #8A8499;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .k-like-btn:hover:not(:disabled) {
          border-color: rgba(224,107,107,0.35);
          background: rgba(224,107,107,0.08);
          color: #E06B6B;
        }
        .k-like-btn.liked {
          background: rgba(224,107,107,0.12);
          color: #E06B6B;
          border-color: rgba(224,107,107,0.28);
        }
        .k-like-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="k-card">

        {/* Cover */}
        <div
          className="k-card-cover"
          style={{ background: cover.bg }}
          onClick={() => navigate(`/story/${story.id}`)}
        >
          {cover.emoji}
        </div>

        {/* Body */}
        <div className="k-card-body">

          {/* Tags */}
          <div className="k-card-tags">
            <span className="k-tag k-tag-lang">{story.language}</span>
            <span className="k-tag k-tag-genre">{story.genre}</span>
          </div>

          {/* Title */}
          <h2
            className="k-card-title"
            onClick={() => navigate(`/story/${story.id}`)}
          >
            {story.title}
          </h2>

          {/* Preview */}
          <p className="k-card-preview">
            {story.content
              ? story.content.slice(0, 100) + "..."
              : "No description available"}
          </p>

          {/* Author */}
          <p className="k-card-author">By {story.author || "Unknown Author"}</p>

          {/* Footer */}
          <div className="k-card-footer">

            {/* Read */}
            <button
              className="k-read-btn"
              onClick={() => navigate(`/story/${story.id}`)}
            >
              Read Story →
            </button>

            {/* Like — same logic as before */}
            <button
              className={`k-like-btn ${liked ? "liked" : ""}`}
              onClick={handleLike}
              disabled={loading}
            >
              <span style={{ fontSize: "14px" }}>
                {liked ? "♥" : "♡"}
              </span>
              <span>{likeCount}</span>
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
