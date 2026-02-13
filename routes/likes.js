var express = require("express");
var router = express.Router();

var Like = require("../models/likes");

// Création d'un like
// POST /likes
router.post("/", function (req, res) {
  const { user_id, tweet_id } = req.body;

  if (!user_id || !tweet_id) {
    //si les champs sont vides
    return res.json({
      result: false,
      error: "user_id et tweet_id sont requis",
    });
  }

  const newLike = new Like({
    //Création d'un user ID et d'un Tweet ID pour identifier le tweet liké
    user_id,
    tweet_id,
  });

  newLike
    .save()
    .then((data) => {
      res.json({ result: true, like: data });
    })
    .catch((err) => {
      console.log("Erreur POST /likes :", err);
      res.json({ result: false, error: "like non créé" });
    });
});

// Récupérer tous les likes d'un tweet
// GET /likes/:tweetId
router.get("/:tweetId", function (req, res) {
  Like.find({ tweet_id: req.params.tweetId })
    .populate("user_id", "firstname") //Récupère les personnes qui ont liké le tweet
    .then((data) => {
      res.json({ result: true, likes: data });
    })
    .catch((err) => {
      console.log("Erreur GET", err);
      res.json({ result: false, error: "likes non trouvés" });
    });
});

// Suppression d'un like
// DELETE /likes/:id
router.delete("/:id", function (req, res) {
  Like.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => {
      console.log("Erreur DELETE :", err);
      res.json({ result: false, error: "like non supprimé" });
    });
});

module.exports = router;
