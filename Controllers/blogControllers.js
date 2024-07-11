const asyncHandler = require("express-async-handler");
const dbCollection = require("../firebaseConfigs");
// const dbCollection = require('../firebaseConfig');

const createBlogPost = asyncHandler(async (req, res) => {
  const { blogTitle, blogContent, blogAuthor } = req.body;
  try {
    const postData = await dbCollection.collection("Blogs").add({
      blogTitle,
      blogContent,
      blogAuthor,
    });
    console.log((await postData.get()).data());
    res.status(201).json({
      message: "Post created successfully",
      data : (await postData.get()).data(),
    });
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    return res.status(500).json({
      message: "Failed to create post",
      err,
    });
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const blogs = await dbCollection.collection("Blogs").get();
    const blogData = blogs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('====================================');
    console.log(blogData);
    console.log('====================================');
    res.status(200).json({
      message: "All blogs fetched successfully",
      blogData,
    });
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    return res.status(500).json({
      message: "Failed to get post",
      err: err,
    });
  }
});

const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await dbCollection.collection("Blogs").doc(id).get();
    if (!blog.exists) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    const blogData = {
      id: blog.id,
      ...blog.data(),
    };
    res.status(200).json({
      message: "Blog fetched successfully",
      blogData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch blog",
      err,
    });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await dbCollection.collection("Blogs").doc(id).delete();
    if (!blog.exists) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete blog",
      err,
    });
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { blogTitle, blogContent, blogAuthor } = req.body;
  try {
    const blog = await dbCollection.collection("Blogs").doc(id).update({
      blogTitle,
      blogContent,
      blogAuthor,
    });
    console.log('====================================');
    console.log(blog.writeTime);
    console.log('====================================');
    if (!blog.writeTime) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
   return res.status(200).json({
      message: "Blog updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update blog",
      err,
    });
  }
});

const filterPostByAuthorAndTitle = asyncHandler(async (req, res) => {
  const { author, title } = req.body;
  try {
    let blogs 
    if(author && title){
         blogs = await dbCollection
      .collection("Blogs")
      .where("blogAuthor", "==", author)
      .where("blogTitle", "==", title)
      .get();
    }
    else if(author && !title){
        blogs = await dbCollection
      .collection("Blogs")
      .where("blogAuthor", "==", author)
      .get();
    }
    else if(!author && title){
        blogs = await dbCollection
      .collection("Blogs")
      .where("blogTitle", "==", title)
      .get();
    }
     if (blogs.empty) {
      return res.status(404).json({
        message: "Blogs not found",
      });
    }
    const blogData = blogs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({
      message: "Blogs fetched successfully",
      blogData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch blogs",
      err,
    });
  }
});

module.exports = {
  createBlogPost,
  getAllBlog,
  getSingleBlog,
  deleteBlog,
  updatePost,
  filterPostByAuthorAndTitle
};
