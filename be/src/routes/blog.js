const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updatePost,
  deletePost,
} = require("../controllers/blogController");

// Varioble validate
const validateParams = [
  body("title").isLength({ min: 5 }).withMessage("Mininum 5 characters"),
  body("body").isLength({ min: 5 }).withMessage("Mininum 5 characters"),
];

// Create Post
router.post("/post", validateParams, createBlogPost);

// Get All Post
router.get("/posts", getAllBlogPosts);

// Get Detail Post
router.get("/post/:postId", getBlogPostById);

// Update Post
router.put("/post/:postId", validateParams, updatePost);

// Delete Post
router.delete("/post/:postId", deletePost);
module.exports = router;
