
module.exports = function (req, res, next) {
  console.log('policy hit')
  let token = req.headers.authorization

  //console.log(req.headers.authorization)
  // if (req.headers && req.headers.authorization) {
  //   var parts = req.headers.authorization.split(' ');
  //   if (parts.length == 2) {
  //     var scheme = parts[0],
  //       credentials = parts[1];
  //
  //     if (/^Bearer$/i.test(scheme)) {
  //       token = credentials;
  //     }
  //   } else {
  //     console.log("Error 14")
  //     return ResponseService.json(401, res, "Format is Authorization: Bearer [token]");
  //   }
  // } else if (req.param('token')) {
  //   token = req.param('token');
  //
  //   delete req.query.token;
  // } else {
  //   console.log("Error 22")
  //   return ResponseService.json(401, res, "No authorization header was found");
  // }
  //ßjwt.verify(token, jwtSecret)
  JwtService.verify(token.toString(), function(err, decoded){
    if (err) {
      console.log(err)
      return ResponseService.json(401, res, "Invalid Token!")
    };
    req.token = token;
    User.findOne({id: decoded.id}).then(function(user){
      req.current_user = user;
      req.username = user.username
      req.userId = user.id
      next();
    })
  });

}
