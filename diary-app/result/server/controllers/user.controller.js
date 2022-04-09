const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user.model');
const Order = require('../models/order.model');

const userSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email(),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().valid(Joi.ref('password')),
  roles: Joi.array(),
  isActive: Joi.boolean(),
})


module.exports = {
  insert,
  getUsers,
  update,
  getOrders
}

//inserts a new user
async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  checkUser = await User.findOne({email:user.email})
  if(checkUser)
    return false
  delete user.password;
  return await new User(user).save();
}

//gets all the users
async function getUsers(){
  return await User.find(); 
}

//updates the given user object
async function update(user){
  const filter = { email: user.email };
  return await User.findOneAndUpdate( filter, user, { new: true } ); 
}

//gets all the orders
async function getOrders(startDate, endDate){
  return await Order.find({createdAt: { $gte: startDate, $lte: endDate}}).sort({createdAt: 1});
}

