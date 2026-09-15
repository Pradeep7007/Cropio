import React, { useState, useEffect, useMemo } from "react";
import Sarah from "../../../assets/images/sarah_miller.jpeg";
import David from "../../../assets/images/david_chen.jpeg";

const filterOptions = {
  Crop: ["All Crops", "Wheat", "Rice", "Corn", "Tomato", "General"],
  Location: ["All Locations", "India", "USA", "China"],
  Language: ["All Languages", "English", "Hindi"],
  Tags: ["All Tags", "Sustainable", "Organic", "AI", "Pest Control", "Irrigation"],
};

export default function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const [filters, setFilters] = useState({
    Crop: "allcrops",
    Location: "alllocations",
    Language: "alllanguages",
    Tags: "alltags",
  });

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    crop: "Wheat",
    location: "India",
    language: "English",
    tags: "Organic, Sustainable",
    author: "",
  });

  const apiUrl =
    import.meta.env.VITE_FARMER_API_URL || "http://localhost:5000/api/farmer";

  // Fetch live posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/community/communityfeed`);
      if (res.ok) {
        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          // Normalize posts
          const normalized = data.posts.map((p, idx) => ({
            ...p,
            image: idx % 2 === 0 ? Sarah : David,
            crop: (p.crop || "general").toLowerCase(),
            location: (p.location || "india").toLowerCase(),
            language: (p.language || "english").toLowerCase(),
            tags: (p.tags || []).map((t) => t.toLowerCase().replace(/\s+/g, "")),
          }));
          setPosts(normalized);
        }
      }
    } catch (err) {
      console.warn("Using local dynamic community store:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFilterChange = (label, value) => {
    setFilters((prev) => ({ ...prev, [label]: value }));
    setCurrentPage(1);
  };

  const handleLike = async (id) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );

    try {
      await fetch(`${apiUrl}/community/communitypost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", postId: id }),
      });
    } catch {
      // Offline fallback already updated in state
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.description.trim()) return;

    const storedUser = localStorage.getItem("userObj");
    let authorName = newPost.author.trim();
    if (!authorName && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        authorName = parsed.name || parsed.username;
      } catch {}
    }
    if (!authorName) authorName = "Farmer " + Math.floor(100 + Math.random() * 900);

    const tagArray = newPost.tags
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/\s+/g, ""))
      .filter(Boolean);

    const createdPost = {
      id: `post-${Date.now()}`,
      author: authorName,
      title: newPost.title,
      description: newPost.description,
      crop: newPost.crop.toLowerCase(),
      location: newPost.location.toLowerCase(),
      language: newPost.language.toLowerCase(),
      tags: tagArray.length ? tagArray : ["general"],
      likes: 0,
      image: Math.random() > 0.5 ? Sarah : David,
      createdAt: "Just now",
    };

    setPosts((prev) => [createdPost, ...prev]);
    setShowModal(false);
    setNewPost({
      title: "",
      description: "",
      crop: "Wheat",
      location: "India",
      language: "English",
      tags: "Organic, Sustainable",
      author: "",
    });

    try {
      await fetch(`${apiUrl}/community/communitypost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdPost),
      });
    } catch (err) {
      console.warn("Post saved locally:", err);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const cropMatch =
        filters.Crop === "allcrops" ||
        (post.crop && post.crop.toLowerCase() === filters.Crop);
      const locationMatch =
        filters.Location === "alllocations" ||
        (post.location && post.location.toLowerCase().includes(filters.Location));
      const languageMatch =
        filters.Language === "alllanguages" ||
        (post.language && post.language.toLowerCase() === filters.Language);
      const tagsMatch =
        filters.Tags === "alltags" ||
        (post.tags &&
          post.tags.some(
            (tag) => tag.toLowerCase() === filters.Tags.toLowerCase()
          ));

      const searchMatch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      return cropMatch && locationMatch && languageMatch && tagsMatch && searchMatch;
    });
  }, [posts, filters, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        
        {/* Header with Share Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#121b0e]">
              Farmer Community Forum
            </h1>
            <p className="text-sm text-[#67974e] mt-1">
              Ask questions, exchange practical agronomic insights, and connect with fellow growers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer"
            >
              <span>✏️</span>
              <span>Ask Question / Share Post</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, pest solutions, crop queries, or authors..."
              className="w-full bg-white border border-[#d7e7d0] rounded-xl px-4 py-3 pl-11 text-sm text-[#121b0e] placeholder-gray-400 focus:outline-none focus:border-green-600 transition"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Left Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0 bg-white border border-[#e2e8e0] rounded-2xl p-5 h-fit shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#121b0e]">Filters</h2>
              <button
                onClick={() =>
                  setFilters({
                    Crop: "allcrops",
                    Location: "alllocations",
                    Language: "alllanguages",
                    Tags: "alltags",
                  })
                }
                className="text-xs text-green-700 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {Object.entries(filterOptions).map(([label, options]) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#d7e7d0] bg-[#fafbf9] px-3 py-2 text-sm text-[#121b0e] focus:outline-none focus:border-green-600"
                    value={filters[label]}
                    onChange={(e) =>
                      handleFilterChange(label, e.target.value.toLowerCase().replace(/\s+/g, ""))
                    }
                  >
                    {options.map((opt) => (
                      <option
                        key={opt}
                        value={opt.toLowerCase().replace(/\s+/g, "")}
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
              Showing <b>{filteredPosts.length}</b> community posts
            </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-500">
                Loading community feed...
              </div>
            ) : paginatedPosts.length ? (
              paginatedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-[#e2e8e0] p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.image || Sarah}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover border border-green-200"
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#121b0e]">
                          {post.author}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {post.crop} Grower • {post.location} • {post.createdAt || "Active"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200 capitalize">
                      {post.crop}
                    </span>
                  </div>

                  <h3 className="font-bold text-base md:text-lg text-gray-900 mt-3">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(post.tags || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="inline-flex items-center gap-1.5 text-green-700 font-semibold hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <span>👍 Helpful</span>
                      <span className="bg-green-100 text-green-800 px-1.5 py-0.2 rounded-full font-bold">
                        {post.likes || 0}
                      </span>
                    </button>
                    <span className="text-gray-400">
                      Language: {post.language || "English"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <p className="text-gray-600 font-medium">
                  No community posts match your selected filter criteria.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      Crop: "allcrops",
                      Location: "alllocations",
                      Language: "alllanguages",
                      Tags: "alltags",
                    })
                  }
                  className="mt-3 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Post Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">
                  Share Your Farming Experience
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={newPost.author}
                    onChange={(e) =>
                      setNewPost({ ...newPost, author: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Related Crop
                    </label>
                    <select
                      value={newPost.crop}
                      onChange={(e) =>
                        setNewPost({ ...newPost, crop: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Corn">Corn</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Cotton">Cotton</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={newPost.language}
                      onChange={(e) =>
                        setNewPost({ ...newPost, language: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Effective organic solution for leaf curl in chilly"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description & Agronomic Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share dosage, methods, observations, or your specific question..."
                    value={newPost.description}
                    onChange={(e) =>
                      setNewPost({ ...newPost, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Organic, Pest Control, Bio-Fertilizer"
                    value={newPost.tags}
                    onChange={(e) =>
                      setNewPost({ ...newPost, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
