const { communityPosts } = require("./CommunityFeed");

module.exports = function CommunityPost(req, res) {
  try {
    const { action, postId } = req.body;

    // Handle Like action
    if (action === "like" && postId) {
      const post = communityPosts.find((p) => p.id === postId);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        return res.status(200).json({ success: true, post, message: "Liked post" });
      }
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const { author, role, location, crop, language, title, description, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required to share a community post.",
      });
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: author?.trim() || "Anonymous Farmer",
      role: role?.trim() || "Farmer",
      location: location?.trim() || "India",
      crop: crop?.trim() || "General",
      language: language?.trim() || "English",
      title: title.trim(),
      description: description.trim(),
      tags: Array.isArray(tags) ? tags : [tags || "Farming"],
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    communityPosts.unshift(newPost);

    res.status(201).json({
      success: true,
      message: "Post published to community successfully!",
      post: newPost,
    });
  } catch (err) {
    console.error("Error creating community post:", err);
    res.status(500).json({ success: false, message: "Server error creating post" });
  }
};