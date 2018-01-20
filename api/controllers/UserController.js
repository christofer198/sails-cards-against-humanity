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
	}
};
