var express = require("express");
var router = express.Router();

var Like = require("../models/likes");

router.post("/tweet/:tweetId/like", function (req, res) { const newLike = new Like