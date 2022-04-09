const express = require("express");
const asyncHandler = require("express-async-handler");
const checkoutController = require("../controllers/checkout.controller");
const passport = require("passport");

const router = express.Router();

module.exports = router;

/** Guard to let only logged in users access this route */
router.post("/", passport.authenticate("jwt", { session: false }), checkout);
router.get("/orders/:email", passport.authenticate("jwt", { session: false }), listOrders);
router.delete("/orders/:id", passport.authenticate("jwt", { session: false }), deleteOrder);
router.delete("/orders", passport.authenticate("jwt", { session: false }), deleteall);
router.put("/orders", passport.authenticate("jwt", { session: false }), updateOrder);


async function checkout(req, res) {
	let orderStatus = await checkoutController.processOrder(req);
	res.json(orderStatus);
}

async function listOrders(req, res) {
	let email = req.params.email;
	let orders = await checkoutController.listOrders(email);
	res.json({ orders, isSuccess: true });
}

async function deleteOrder(req, res) {
	let id = req.params.id;
	let delstatus = await checkoutController.deleteOrder(id);

	if ( delstatus == null )
		res.json({ delstatus, isSuccess: false });
	else
		res.json({ delstatus, isSuccess: true });
}


async function deleteall(req, res) {
	let user = req.user;
	let delstatus = await checkoutController.deleteAllOrders(user.email);

	if ( delstatus == null )
		res.json({ delstatus, isSuccess: false });
	else
		res.json({ delstatus, isSuccess: true });
}

async function updateOrder(req, res) {
	let order = req.body;
	let updateStatus = await checkoutController.updateOrder(order);

	if ( updateStatus == null )
		res.json({ updateStatus, isSuccess: false });
	else
		res.json({ updateStatus, isSuccess: true });
}