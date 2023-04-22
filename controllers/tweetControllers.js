const asyncHandler = require("express-async-handler");
const Tweet = require("../models/tweetModel");

//Get all contacts
//@routes GET /api/contacts
//access private
const getTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({ user_id: req.user.id});
    console.log(tweets)
    res.status(200).json(tweets);
});

//Get a contact
//@routes GET /api/contacts/:id
//access private
const getTweet = asyncHandler(async (req, res) => {
    const tweet = await Contact.findById(req.params.id);
    if(!tweet){
        res.status(404);
        throw new Error("Tweet not found");
    }
    res.status(200).json(tweet);
});

//Create new contact
//@routes POST /api/contacts
//access private
const createTweet = asyncHandler(async (req, res) => {
    console.log(req.body);
    const {name, email} = req.body;
    if(!name || !email){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const tweet = await Tweet.create({
        name, email, tweet, user_id: req.user.id
    });
    res.status(201).json(tweet)
});

//Update a contact
//@routes PUT /api/contacts/:id
//access private
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

//Delete a contact
//@routes POST /api/contacts/:id
//access private
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

module.exports = {getTweets, getTweet, createTweet, updateTweet, deleteTweet};