/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req, res){
		var username = req.param('username')
		var password = req.param('password')

		verifyParams(res, username, password)

		User.findOne({username: username}).exec(function (err, user){

			if(err){
				return invalidusernameOrPassword(res)
			}
			signInUser(req, res, password, user)
		})
	},

	authenticate: function(req,res){
		var responseData = {
			user: {
				username: req.current_user.username,
				id: req.current_user.id
			},
			token: req.token
		}
		return ResponseService.json(200, res, "Successfully signed in", responseData)
	}
};


function signInUser(req, res, password, user) {
  User.comparePassword(password, user).then(
    function (valid) {
      if (!valid) {
        return this.invalidusernameOrPassword(res);
      } else {
        var responseData = {
					user: {
						username: user.username,
						id: user.id
					},
          token: generateToken(user.id)
        }
        return ResponseService.json(200, res, "Successfully signed in", responseData)
      }
    }
  ).catch(function (err) {
    return ResponseService.json(403, res, "err")
  })
};


function invalidusernameOrPassword(res){
  return ResponseService.json(401, res, "Invalid username or password")
};

function verifyParams(res, username, password){
  if (!username || !password) {
    return ResponseService.json(401, res, "username and password required")
  }
};


function generateToken(user_id) {
  return JwtService.issue({id: user_id})
};
