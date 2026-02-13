const mongoose = require("mongoose");

const hashtagSchema = mongoose.Schema({
  name: String,
});

const Hashtag = mongoose.model("hashtags", hashtagSchema);

module.exports = Hashtag;
