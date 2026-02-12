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

  Tweet.updateOne({ _id: req.params.id }, { content })
    .then((data) => {
      if (data.modifiedCount === 0) {
        return res.json({
          result: false,
          error: "tweet non trouvé ou inchangé",
        });
      }
      res.json({ result: true });
    })
    .catch((err) => {
      res.json({ result: false, error: "tweet non modifié" });
    });
});

module.exports = router;
