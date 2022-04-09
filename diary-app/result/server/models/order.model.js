const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		user: {
			email: {
				type: String,
				required: true,
			},
			fullname: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
			address: {
				type: String,
				required: true,
			},
			loggedInEmail: {
				type: String,
				required: true,
			},
		},
		items: [
			{
				quantity: {
					type: Number,
					required: true,
				},
				basePrice: {
					type: Number,
					required: true,
				},
				customizations: [
					{
						type: {
							type: String,
							required: true,
						},
						name: {
							type: String,
							required: true,
						},
						value: {
							type: String,
						},
						price: {
							type: Number,
						},
					},
				],
			},
		],
		total: {
			type: Number,
			required: true,
		},
		payment_method: {
			type: String,
			required: true,
		},
		delivery_method: {
			type: String
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model("Order", OrderSchema);
