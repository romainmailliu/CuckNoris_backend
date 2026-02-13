const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  // Un tweet peut avoir plusieurs hashtags
  hashtags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hashtags",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  deletedAt: Date,
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
