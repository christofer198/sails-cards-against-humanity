/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	home: function(req, res){
		res.view()
	},

	// room: function(req,res){
	// 	if (!req.isSocket) {
	// 	 res.json({bad: "request"})
	//  	}
	// 	res.json({good: "request"})
	// }

};
