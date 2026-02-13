var express = require("express");
var router = express.Router();
var Tweet = require("../models/tweets");

router.post("/", function (req, res) {
  const newTweet = new Tweet({
    content: req.body.content,
    author: req.body.author,
  });

  newTweet
    .save()
    .then((data) => {
      res.json({ result: true, tweets: data });
    })
    .catch((err) => {
      res.json({ result: false, error: "tweet non créé" });
    });
});

router.get("/", function (req, res) {
  Tweet.find()
    .populate("author", "firstname")
    .then((data) => {
      res.json({ result: true, tweets: data });
    })
    .catch((err) => {
      console.log("Erreur GET /tweets :", err);
      res.json({ result: false, error: "tweet non trouvé" });
    });
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
