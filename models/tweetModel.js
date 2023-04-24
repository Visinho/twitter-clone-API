const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Please add your name"],
    },
    email: {
        type: String,
        required: [true, "Please add your email address"],
    },
    tweet: {
        type: String,
        required: [true, "Please add your tweet"],
    },
    comments: [
        {
            comment: String,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]
},{
    timestamps: true,
});


module.exports = mongoose.model("Tweet", tweetSchema);