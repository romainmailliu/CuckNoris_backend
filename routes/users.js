var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// SIGN UP

router.post("/signup", async (req, res) => {
  try {
    // Vérification des champs
    if (!checkBody(req.body, ["firstname", "username", "password"])) {
      return res.json({ result: false, error: "Missing or empty fields" });
    }

    //Vérifie si user existe déjà
    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.json({ result: false, error: "User already exists" });
    }

    // Hash du mot de passe (version async recommandée)
    const hash = await bcrypt.hash(req.body.password, 10);

    // Création du user
    const newUser = new User({
      firstname: req.body.firstname,
      username: req.body.username,
      password: hash,
      token: uid2(32),
      deleted_at: null,
    });

    const newDoc = await newUser.save();

    // Réponse
    res.json({ result: true, token: newDoc.token });

    //Gestion des erreurs
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Server error" });
  }
});

// SIGN IN

router.post("/signin", async (req, res) => {
  try {
    // Vérification des champs
    if (!checkBody(req.body, ["username", "password"])) {
      return res.json({ result: false, error: "Missing or empty fields" });
    }

    // Recherche utilisateur via l'username
    const user = await User.findOne({
      username: req.body.username,
    });

    // Si pas d'username trouvé...
    if (!user) {
      return res.json({
        result: false,
        error: "User not found or wrong password",
      });
    }

    // Si username trouvé -> Vérification user + password
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    // si le password et l'user ne matchent pas
    if (!isMatch) {
      return res.json({
        result: false,
        error: "User not found or wrong password",
      });
    }

    // Si ça match -> Connexion OK
    res.json({ result: true, token: user.token });

    //Gestion des erreurs
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Server error" });
  }
});

router.get("/canTweet/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({ result: true, canTweet: data.canTweet });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
