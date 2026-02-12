const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  tweet_id: { type: mongoose.Schema.Types.ObjectId, ref: "tweets" },
  createdAt: { type: Date, default: Date.now },
});

const Like = mongoose.model("likes", likeSchema);

module.exports = Like;
