import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyStory() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch My Stories
  const fetchMyStories = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch("https://storyapp-38sq.onrender.com/upload/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stories");
      }

      setStories(data);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Story
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        `https://storyapp-38sq.onrender.com/edit/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      // remove deleted story from UI instantly
      setStories(stories.filter((story) => story.id !== id));
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  // Edit Story
  const handleEdit = (id) => {
    navigate(`/edit-story/${id}`);
  };

  useEffect(() => {
    fetchMyStories();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        {error}
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        My Stories ✍️
      </h1>

      {stories.length === 0 ? (
        <h2 className="text-center text-gray-500">
          No stories created yet 😢
        </h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="card bg-base-100 shadow-xl border"
            >
              <div className="card-body">
                {/* Title */}
                <h2 className="card-title">
                  {story.title}
                </h2>

                {/* Badges */}
                <div className="flex gap-2">
                  <span className="badge badge-info">
                    {story.language}
                  </span>

                  <span className="badge badge-success">
                    {story.genre}
                  </span>
                </div>

                {/* Content Preview */}
                <p>
                  {story.content.length > 120
                    ? story.content.slice(0, 120) + "..."
                    : story.content}
                </p>

                {/* Buttons */}
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => handleEdit(story.id)}
                    className="btn btn-outline btn-sm"
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(story.id)}
                    className="btn btn-error btn-sm"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}