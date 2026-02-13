var express = require("express");
var router = express.Router();

var Hashtag = require("../models/hashtag");

//  Récupérer tous les hashtags
router.get("/", async (req, res) => {
  try {
    const hashtags = await Hashtag.find(
      {}, // pas de filtre
      { name: 1, count: 1 }, // projection : champs à renvoyer
    );
    res.json({ result: hashtags });
  } catch (error) {
    res.json({ message: "Erreur serveur", error });
  }
});

// Récupérer un hashtag par ID
router.get("/:id", async (req, res) => {
  try {
    const hashtag = await Hashtag.findById(req.params.id);

    if (!hashtag) {
      return res.json({ message: "Hashtag non trouvé" });
    }

    res.json(hashtag);
  } catch (error) {
    res.json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
