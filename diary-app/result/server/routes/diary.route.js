const express = require("express");
const asyncHandler = require("express-async-handler");
const diaryController = require("../controllers/diary.controller");
const passport = require("passport");
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();

module.exports = router;

/** Guard to let only logged in users access this route */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(getDiaryConfig)
);
router.post("/", passport.authenticate("jwt", { session: false }), requireAdmin,  updateDiary)

/**
 * End point returns the customization options of a diary
 */
async function getDiaryConfig(req, res) {
  let diaryConfig = await diaryController.getDiaryConfig(req.body);
  res.json(diaryConfig);
}

async function updateDiary(req, res) {
  let diaryConfig = await diaryController.updateDiaryConfig(req.body);
  res.json(diaryConfig);
}
