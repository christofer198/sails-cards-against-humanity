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
				console.log(user)
				return invalidusernameOrPassword(res)
			}
			signInUser(req, res, password, user)
		})
	}
};


function signInUser(req, res, password, user) {
  User.comparePassword(password, user).then(
    function (valid) {
      if (!valid) {
        return this.invalidusernameOrPassword(res);
      } else {
        var responseData = {
          user: user,
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
