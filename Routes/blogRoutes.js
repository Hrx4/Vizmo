const express = require("express");
const {createBlogPost, getAllBlog, getSingleBlog, deleteBlog, updatePost} = require('../Controllers/blogControllers');
const validateToken = require("../Middleware/validateToken");
const { filterPostByAuthorAndTitle } = require("../Controllers/blogControllers");

const router = express.Router();
router.use(validateToken)
router.route("/").post(
  createBlogPost
).get(getAllBlog)
router.route('/filter').post(filterPostByAuthorAndTitle)
router.route('/single/:id').get(getSingleBlog).delete(deleteBlog).put(updatePost)

module.exports = router;
