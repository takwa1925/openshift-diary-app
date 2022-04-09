const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const moment = require('moment');

const userCtrl = require('../controllers/user.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.post('/create', passport.authenticate('jwt', { session: false }), requireAdmin , asyncHandler(register));
router.get('/getusers', passport.authenticate('jwt', { session: false }), requireAdmin , asyncHandler(getUsers));
router.put('/updateusers', passport.authenticate('jwt', { session: false }), requireAdmin , asyncHandler(updateUser));
router.post('/report', passport.authenticate('jwt', { session: false }), requireAdmin , asyncHandler(fetchReport));


//registers the new admin
async function register(req, res, next) {
  //add the value "admin" to the roles
  req.body.roles = ['admin'];
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  res.json({ user, isSuccess: true });
}

//gets the list of users(customers, admin)
async function getUsers(req, res, next){
  let userList = await userCtrl.getUsers();
  res.json({ userList, isSuccess: true });
}

//update the user's active status
async function updateUser(req, res, next){
  var userlist = [];
  console.log(req.body.users);
  for (let data of req.body.users) {
    let user = await userCtrl.update(data);
    user = user.toObject();
    userlist.push(user);
  }

  res.json({ userlist, isSuccess: true });
}

//Fetch reports
async function fetchReport(req, res, next){
  var userlist = [];
  let startDate = req.body.startDate
  if(!startDate)
  {
    res.json({ Message:"startDate is a mandatory parameter", isSuccess: false }); 
  }
  let period = req.body.period
  let endDate
  if(!period)
  {
    res.json({ Message:"period is a mandatory parameter", isSuccess: false }); 
  }
  if(period == 'MONTH')
  {
    endDate = moment(startDate).add(1, 'M').toDate()
  }
  else if (period == 'WEEK')
  {
    endDate = moment(startDate).add(1, 'w').toDate()
  }
  else
  {
    res.json({ Message:"period should be mo", isSuccess: false });
  }
  let orderList = await userCtrl.getOrders(startDate, endDate)
  res.json({ orderList, isSuccess: true });
}
