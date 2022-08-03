const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User, validateUser, validateUserUpdate } = require("../models/users");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    return res.status(400).send("email already registered");
  }

  user = await new User(req.body);
  user.email = user.email.toLowerCase();
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/admin/add", auth, isAdmin, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    return res.status(400).send("email already registered");
  }

  user = await new User(req.body);
  user.email = user.email.toLowerCase();
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/", auth, async (req, res) => {
  const users = await User.find();
  if (!users || users.length == 0) {
    return res.status(404).send("No users");
  }
  res.send(users.map((user) => _.pick(user, ["_id", "name", "email", "admin"])));
});

router.get("/friends", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).send("User not found.");
  }
  const friends = await User.find({ _id: { $in: user.friends } });
  if (!friends || friends.length === 0) {
    res.status(404).send("User has no friends.");
    return;
  }

  res.send(friends.map((friend) => friend._id));
});

router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const { error } = validateUserUpdate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    );
    if (!user) {
      res.status(404).send("User not found.");
      return;
    }
    res.send(user);
  } catch {
    return res.status(404).send("User not found.");
  }
});

router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const found = await User.findOneAndDelete({ _id: req.params.id });
    if (!found) {
      return res.status(404).send("User not found.");
    }
    res.send({ ok: true });
  } catch {
    return res.status(404).send("User not found.");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const found = await User.findByIdAndUpdate({ _id: req.params.id });
    if (!found || found.length === 0) {
      return res.status(404).send("User not found.");
    }
    res.send(_.pick(found, ["_id", "name", "email", "admin"]));
  } catch {
    return res.status(404).send("User not found.");
  }
});

router.put("/friends/add/:id", auth, async (req, res) => {
  try {
    const friend = await User.findOneAndUpdate(
      { _id: req.params.id, friends: { $nin: req.user._id } },
      { $push: { friends: req.user._id } },
      { new: true }
    );
    if (!friend) {
      return res.status(404).send("Designated user was not found or is already your friend");
    }
    const user = await User.findOneAndUpdate({ _id: req.user._id, friends: { $nin: friend._id } }, { $push: { friends: friend._id } }, { new: true });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send(_.pick(friend, ["_id", "name", "email"]));
  } catch {
    return res.status(404).send("User not found.");
  }
});

router.delete("/friends/remove/:id", auth, async (req, res) => {
  try {
    const friend = await User.findOneAndUpdate(
      { _id: req.params.id, friends: { $in: req.user._id } },
      { $pull: { friends: req.user._id } },
      { new: true }
    );
    if (!friend) {
      return res.status(404).send("Designated user was not found or you're not friend");
    }
    const user = await User.findOneAndUpdate({ _id: req.user._id, friends: { $in: friend._id } }, { $pull: { friends: friend._id } }, { new: true });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send({ ok: true });
  } catch {
    return res.status(404).send("User not found.");
  }
});

module.exports = router;
