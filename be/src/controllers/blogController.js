const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const BlogPost = require("../model/blogModel");

// Create Post
const createBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image required!");
    err.errorStatus = 422;
    throw err;
  }

  const { title, body } = req.body;
  const image = req.file.path;

  const Posting = new BlogPost({
    title: title,
    body: body,
    image: image,
    author: {
      uid: 1,
      name: "Winda Rahayu",
    },
  });

  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create blog success!",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get All Post
const getAllBlogPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  let totalData;

  BlogPost.find()
    .countDocuments()
    .then((count) => {
      totalData = count;
      return BlogPost.find()
        .skip(parseInt(currentPage - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
      res.status(200).json({
        message: "Success",
        total_data: parseInt(totalData),
        per_page: parseInt(perPage),
        current_page: parseInt(currentPage),
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Get Post By Id
const getBlogPostById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      if (!result) {
        const err = new Error(`Blog post with id ${postId} not found`);
        err.errorStatus = 404;
        throw err;
      }
      res.status(200).json({
        message: "Success",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Update Post
const updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("invalid value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image required!");
    err.errorStatus = 422;
    throw err;
  }

  const { title, body } = req.body;
  const image = req.file.path;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog post not found");
        err.errorStatus = 404;
        throw err;
      }
      post.title = title;
      post.body = body;
      post.image = image;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Update success",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const removeImage = (filepath) => {
  filepath2 = path.join(__dirname, "../../", filepath);
  fs.unlink(filepath2, (err) => {
    console.log(err);
  });
};

// Delete Post
const deletePost = (req, res, next) => {
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog post not found");
        err.errorStatus = 404;
        throw err;
      }
      removeImage(post.image);
      return BlogPost.findByIdAndRemove(post.id);
    })
    .then((result) => {
      res.status(200).json({
        message: "Data deleted",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updatePost,
  deletePost,
};
