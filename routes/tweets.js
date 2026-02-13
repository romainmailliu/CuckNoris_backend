var express = require("express");
var router = express.Router();
var Tweet = require("../models/tweets");
var Hashtag = require("../models/hashtag");

// Créer un tweet

// ✅ Créer un tweet
router.post("/", async function (req, res) {
  try {
    const { content, author } = req.body;

    // ✅ 1. Extraction des hashtags
    const regex = /#(\w+)/g;
    const matches = [...content.matchAll(regex)];
    const tags = [];

    for (let match of matches) {
      tags.push(match[1].toLowerCase());
    }

    const uniqueTags = [];

    for (let tag of tags) {
      if (!uniqueTags.includes(tag)) {
        uniqueTags.push(tag);
      }
    }
    const hashtagIds = [];

    // ✅ 2. Vérifier / créer les hashtags
    for (let tag of uniqueTags) {
      let hashtag = await Hashtag.findOne({ name: tag });

      if (!hashtag) {
        hashtag = await Hashtag.create({ name: tag });
      }

      hashtagIds.push(hashtag._id);
    }

    // ✅ 3. Création du tweet avec hashtags
    const newTweet = new Tweet({
      content,
      author,
      hashtags: hashtagIds,
    });

    const data = await newTweet.save();

    res.json({ result: true, tweet: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: "tweet non créé" });
  }
});

module.exports = router;

router.delete("/:id", function (req, res) {
  Tweet.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.json({ result: true, tweets: data });
    })
    .catch((err) => {
      res.json({ result: false, error: "tweet non supprimé" });
    });
});

router.put("/:id", function (req, res) {
  const { content } = req.body; // le nouveau texte du tweet

  Tweet.findByIdAndUpdate(
    req.params.id,
    { content },
    { new: true }, // renvoie le tweet après modification
  )
    .then((tweet) => {
      if (!tweet) {
        return res.json({ result: false, error: "tweet non trouvé" });
      }
      res.json({ result: true, tweet });
    })
    .catch((err) => {
      res.json({ result: false, error: "tweet non modifié" });
    });
});

module.exports = router;
