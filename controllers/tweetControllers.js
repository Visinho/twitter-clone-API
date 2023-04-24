const asyncHandler = require("express-async-handler");
const Tweet = require("../models/tweetModel");

//Get all tweets
const getTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({ 
        user_id: req.user.id,
    });
    console.log(tweets)
    res.status(200).json(tweets);
});

//Get a tweet
const getTweet = asyncHandler(async (req, res) => {
    const tweet = await Tweet.findById(req.params.id);
    if(!tweet){
        res.status(404);
        throw new Error("Tweet not found");
    }
    res.status(200).json(tweet);
});

//Create new tweet
const createTweet = asyncHandler(async (req, res) => {
    console.log(req.body);
    const {name, email, tweet} = req.body;
    if(!name || !email || !tweet){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const createTweet = await Tweet.create({
        name, email, tweet, user_id: req.user.id
    });
    res.status(201).json(tweet)
});

//Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const tweet = await Tweet.findById(req.params.id);
    if(!tweet){
        res.status(404);
        throw new Error("Tweet not found");
    }

    if(tweet.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User does not have permission to update this tweet")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.id, req.body, {new: true}
    );
    res.status(200).json(updatedTweet);
});

//Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
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
});

//Create a comment
const comment = asyncHandler(async (req,res) => {
    let comment = req.body
    comment.postedBy = req.user.id

    Tweet.findByIdAndUpdate(
        req.params.id,
        {$push: { comments: comment }},
        { new: true }
    )
    
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")

    .exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }else{
            res.json(result);
        }
    }
    )
})

//Create a comment
const uncomment = asyncHandler(async (req,res) => {
    let comment = req.body

    Tweet.findByIdAndUpdate(
        req.params.id,
        {$pull: { comments: {_id: comment._id} }},
        { new: true }
    )
    
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")

    .exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }else{
            res.json(result);
        }
    }
    )
})


module.exports = {getTweets, getTweet, createTweet, updateTweet, deleteTweet, comment, uncomment};