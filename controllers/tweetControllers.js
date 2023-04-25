const asyncHandler = require("express-async-handler");
const Tweet = require("../models/tweetModel");

//Get all tweets
const getTweets = asyncHandler(async (req, res) => {
    try {
      const tweets = await Tweet.find({
        user_id: req.user.id,
      });
      console.log(tweets);
      res.status(200).json(tweets);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  });

//Get a tweet
const getTweet = asyncHandler(async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
        return res.status(404).json({ error: "Tweet not found" });
      }
      res.status(200).json(tweet);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  });

//Create new tweet
const createTweet = asyncHandler(async (req, res) => {
    try {
      const { name, email, tweet } = req.body;
      if (!name || !email || !tweet) {
        return res.status(400).json({ error: "All fields are mandatory" });
      }
      const createdTweet = await Tweet.create({
        name,
        email,
        tweet,
        user_id: req.user.id,
      });
      res.status(201).json(createdTweet);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  });

//Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
        return res.status(404).json({ error: "Tweet not found" });
      }
  
      if (tweet.user_id.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "User does not have permission to update this tweet" });
      }
  
      const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedTweet);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  });

//Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if(!tweet){
        res.status(404);
        throw new Error("Contact not found")
      }
      if(tweet.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User does not have permission to delete this tweet")
      }
      await Tweet.deleteOne({_id: req.params.id});
      res.status(200).json("Deleted");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//Create a comment to a tweet
const comment = asyncHandler(async (req, res) => {
    try {
      const userId = req.params.userId;
      const comment = req.body.comment;
  
      const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: { comment, postedBy: userId } } },
        { new: true }
      )
        .populate("comments.postedBy", "_id name")
        .exec();
  
      if (!updatedTweet) {
        return res.status(404).json({ error: "Tweet not found" });
      }
  
      res.status(201).json(updatedTweet);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  });

//Delete a comment
const uncomment = asyncHandler(async (req, res) => {
    try {
      const { tweetId, commentId } = req.params;
  
      const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      )
        .populate("comments.postedBy", "_id name")
        .exec();
  
      if (!updatedTweet) {
        return res.status(404).json({ error: "Tweet not found" });
      }
  
      res.status(200).json(updatedTweet);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  });









module.exports = {getTweets, getTweet, createTweet, updateTweet, deleteTweet, comment, uncomment};