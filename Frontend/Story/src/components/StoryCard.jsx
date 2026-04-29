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
        `https://storyapp-38sq.onrender.com/like/${story.id}/`,
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
    Adventure: {
      emoji: "⚔️",
      bg: "linear-gradient(135deg, #1E2A4A 0%, #2D3F6E 100%)",
    },
    Horror: {
      emoji: "🕯️",
      bg: "linear-gradient(135deg, #1E1226 0%, #341640 100%)",
    },
    Fantasy: {
      emoji: "🌙",
      bg: "linear-gradient(135deg, #12291E 0%, #1E4030 100%)",
    },
    Moral: {
      emoji: "🌱",
      bg: "linear-gradient(135deg, #2A1C10 0%, #4A3218 100%)",
    },
  };

  const cover =
    coverEmoji[story.genre] || {
      emoji: "📖",
      bg: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)",
    };

  return (
    <div
      className="
        w-[230px]
        flex-shrink-0
        bg-[#161320]
        border
        border-[rgba(200,169,110,0.15)]
        rounded-2xl
        overflow-hidden
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[rgba(200,169,110,0.4)]
        hover:shadow-2xl
        font-sans
      "
    >
      {/* Cover */}
      <div
        className="
          h-[130px]
          flex
          items-center
          justify-center
          text-[46px]
        "
        style={{ background: cover.bg }}
        onClick={() => navigate(`/story/${story.id}`)}
      >
        {cover.emoji}
      </div>

      {/* Body */}
      <div className="p-[14px] px-4 pb-4">
        {/* Tags */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span
            className="
              text-[10px]
              px-3
              py-1
              rounded-full
              font-medium
              capitalize
              bg-[rgba(123,94,167,0.2)]
              text-[#B49BD4]
            "
          >
            {story.language}
          </span>

          <span
            className="
              text-[10px]
              px-3
              py-1
              rounded-full
              font-medium
              capitalize
              bg-[rgba(200,169,110,0.15)]
              text-[#C8A96E]
            "
          >
            {story.genre}
          </span>
        </div>

        {/* Title */}
        <h2
          onClick={() => navigate(`/story/${story.id}`)}
          className="
            text-[14px]
            font-medium
            leading-[1.45]
            mb-2
            text-[#F0EBE0]
            line-clamp-2
          "
        >
          {story.title}
        </h2>

        {/* Preview */}
        <p
          className="
            text-[12px]
            text-[#8A8499]
            leading-[1.65]
            mb-2
            line-clamp-2
          "
        >
          {story.content
            ? story.content.slice(0, 100) + "..."
            : "No description available"}
        </p>

        {/* Author */}
        <p className="text-[11px] text-[#5F5E70] mb-4">
          By {story.author || "Unknown Author"}
        </p>

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-between
            pt-3
            border-t
            border-[rgba(200,169,110,0.1)]
          "
        >
          {/* Read */}
          <button
            className="
              text-[12px]
              font-medium
              text-[#C8A96E]
              bg-transparent
              border-none
              cursor-pointer
              transition-colors
              hover:text-[#E8C98A]
            "
            onClick={() => navigate(`/story/${story.id}`)}
          >
            Read Story →
          </button>

          {/* Like */}
          <button
            className={`
              flex
              items-center
              gap-1
              text-[12px]
              px-3
              py-1
              rounded-full
              border
              cursor-pointer
              transition-all
              ${
                liked
                  ? "bg-[rgba(224,107,107,0.12)] text-[#E06B6B] border-[rgba(224,107,107,0.28)]"
                  : "bg-transparent text-[#8A8499] border-[rgba(200,169,110,0.18)] hover:border-[rgba(224,107,107,0.35)] hover:bg-[rgba(224,107,107,0.08)] hover:text-[#E06B6B]"
              }
            `}
            onClick={handleLike}
            disabled={loading}
          >
            <span className="text-[14px]">
              {liked ? "♥" : "♡"}
            </span>

            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}