const express = require("express");
const postRouter = express.Router();
const postS = require("../models/Post");



// get all posts
postRouter.get("/all", async (req, res) => {
  try {
    const result = await postS.find();
    res.send({ list: result, msg: "list of posts" });
  } catch (error) {
    console.log(error);
  }
});

// get by id
postRouter.get("/:id", async (req, res) => {
  try {
    const result = await postS.findById({ _id: req.params.id });
    res.send({ post: result, msg: "voici post" });
  } catch (error) {
    console.log(error);
  }
});

// delete of post
postRouter.delete("/:id", async (req, res) => {
  try {
    const result = await postS.findByIdAndDelete({ _id: req.params.id });
    res.send({ msg: "post deleted" });
  } catch (error) {
    console.log(error);
  }
});

// update of post
postRouter.put("/:id", async (req, res) => {
  try {
    const result = await postS.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    res.send({ msg: "post updated" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = postRouter;
