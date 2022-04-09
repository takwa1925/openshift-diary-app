const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const adminRoutes = require("./admin.route");
const diaryRoutes = require("./diary.route");
const checkoutRoutes = require("./checkout.route");

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/diary", diaryRoutes);
router.use("/checkout", checkoutRoutes);

module.exports = router;
