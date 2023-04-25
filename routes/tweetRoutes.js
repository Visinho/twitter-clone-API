const express = require("express");
const router = express.Router();
const {getTweets, createTweet, getTweet, updateTweet, deleteTweet, comment, uncomment} = require("../controllers/tweetControllers");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getTweets).post(createTweet);
router.route("/:id").get(getTweet).put(updateTweet).delete(deleteTweet);

router.route("/comment/user/:userId/tweet/:id").put(comment)
router.route("/uncomment/:tweetId/:commentId").put(uncomment);




module.exports = router;