const Joi = require("joi");
const Diary = require("../models/diary.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

module.exports = {
	processOrder,
	listOrders,
	deleteOrder,
	updateOrder,
	deleteAllOrders
};

const userSchema = Joi.object().keys({
	email: Joi.string().required(),
	fullname: Joi.string().required(),
	phone: Joi.string().required(),
	address: Joi.string().required(),
});

const customizationSchema = Joi.object().keys({
	type: Joi.string().required(),
	name: Joi.string().required(),
	image: Joi.string(),
});

const itemSchema = Joi.object().keys({
	quantity: Joi.number().required(),
	basePrice: Joi.number().required(),
	customizations: Joi.array().items(customizationSchema).min(1),
});

const orderSchema = Joi.object({
	user: userSchema.required(),
	items: Joi.array().items(itemSchema).min(1),
	payment_method: Joi.string().required(),
	delivery_method: Joi.string(),
});

async function processOrder(req) {
	
	let order = req.body;
	let loggedInUser = req.user;

	try {
		order = await Joi.validate(order, orderSchema, { abortEarly: false });
		diary = await Diary.find({ name: "Diary" });
		total = 0;

		for (item of order.items) {
			for (customization of item.customizations) {
				switch (customization.type) {
					case "paperColor":
						customization.price = diary[0].customization.paperColor.filter(
							(paperColorItem) => {
								return paperColorItem.name == customization.name;
							}
						)[0].price;
						total += parseFloat(customization.price);
						break;

					case "coverTheme":
						selectedCoverTheme = diary[0].customization.coverTheme.filter(
							(paperColorItem) => {
								return paperColorItem.name == customization.name;
							}
						)[0];
						customization.price = selectedCoverTheme.price;
						customization.image = selectedCoverTheme.image;
						total += parseFloat(customization.price);
						break;

					case "paperType":
						customization.price = diary[0].customization.paperType.filter(
							(paperColorItem) => {
								return paperColorItem.name == customization.name;
							}
						)[0].price;
						total += parseFloat(customization.price);
						break;

					case "coverText":
						break;
				}
			}
			total = (diary[0].basePrice + total) * parseFloat(item.quantity);
			item.basePrice = diary[0].basePrice;
		}
		
		order.user.loggedInEmail = loggedInUser.email
		order.total = total;

		//add extra charge for express delivery
		if (order.delivery_method == "express"){
			order.total += 5.0;

		}

		return await new Order(order).save();

	} catch (error) {
		return error;
	}
}


async function listOrders(email) {
	return await Order.find({'user.loggedInEmail':email}); 
}


async function deleteOrder(id) {
	try{
		return await Order.findByIdAndDelete(id)
	}
	catch(error){
		return null;
	}	
}

async function updateOrder(order) {

	try{
		const filter = { _id: order._id };
		return await Order.findOneAndUpdate( filter, order, { new: true } ); 
	}
	catch(error){
		return null;
	}	
}

async function deleteAllOrders(email) {
	try{
		const filter = {'user.loggedInEmail':email};
		return await Order.deleteMany(filter);
	}
	catch(error){
		return null;
	}	
}
