const mongoose = require("mongoose");

const hashtagSchema = mongoose.Schema({
  name: String,
  count: {
    type: Number,
    default: 1,
  },
});

const Hashtag = mongoose.model("hashtags", hashtagSchema);

module.exports = Hashtag;
