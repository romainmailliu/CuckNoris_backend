const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: String,
    username: String,
    password: String,
    token: String,
    deleted_at: Date,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const User = mongoose.model("users", userSchema);

module.exports = User;
