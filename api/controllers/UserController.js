/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash')

module.exports = {
	create: function(req,res){
		if(req.body.password !== req.body.confirmPassword){
			return ResponseService.json(401, res, "Password mismatch")
		}

		var allowedParameters = ["username", "password"]

		var data = _.pick(req.body, allowedParameters)

		console.log(data)

		User.create(data).then(function(user){
			var responseData = {
				user: user,
				token: JwtService.issue({id:user.id})
			}
			return ResponseService.json(200, res, "USER CREATED", responseData)
		})
	},

	show: function(req, res){
		User.findOne({
		  id: req.param("id")
		}).exec(function (err, user){
		  if (err) {
		    return res.serverError(err);
		  }
		  if (!user) {
		    return res.json({"msg" : "could not find user"});
		  }
		  // sails.log('Found "%s"', finn.fullName);
		  return res.status(200).json(user);
		});
	},
	
	index: function(req, res){
		User.find().exec(function (err, users){
		  if (err) {
		    return res.serverError(err);
		  }
			if (!users) {
				return res.json({"msg" : "No users exist"});
			}
		  // sails.log('Found "%s"', finn.fullName);
		  return res.status(200).json(users);
		});
	}
};
