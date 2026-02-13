var express = require("express");
var router = express.Router();
var Tweet = require("../models/tweets");
var Hashtag = require("../models/hashtag");
var User = require("../models/users");

// Créer un tweet

// ✅ Créer un tweet
router.post("/", async function (req, res) {
  try {
    const { content, token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ result: false, error: "Missing content or token" });
    }

    // ✅ Récupérer l'utilisateur via le token
    const user = await User.findOne({ token });

    if (!user) {
      return res
        .status(401)
        .json({ result: false, error: "User not found or invalid token" });
    }

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

    // ✅ 2. Incrémentation automatique
    for (let tag of uniqueTags) {
      const hashtag = await Hashtag.findOneAndUpdate(
        { name: tag },
        { $inc: { count: 1 } },
        { new: true, upsert: true },
      );

      hashtagIds.push(hashtag._id);
    }

    // ✅ 3. Création du tweet avec hashtags
    const newTweet = new Tweet({
      content,
      author: user._id, // ObjectId de l'utilisateur
      hashtags: hashtagIds,
    });

    const data = await newTweet.save();

    res.json({ result: true, tweet: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: "tweet non créé" });
  }
});

// Récupérer tous les tweets
router.get("/", async function (req, res) {
  try {
    const tweets = await Tweet.find()
      .populate("author", "firstname username") // important car Feed utilise props.author.firstname
      .sort({ createdAt: -1 }); // les plus récents en premier

    res.json({ result: true, tweets });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      result: false,
      error: "Erreur lors de la récupération des tweets",
    });
  }
});

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
