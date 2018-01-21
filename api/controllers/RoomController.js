/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req,res){
		Room.create({
    "title" : "Sample Room",
    "players" : [],
    "currentTurn" : {
        "userId" : 2,
        "blackCard" : 2,
        "pickedCards" : [],
        "currentHands" : []
    },
    "graveYard" : {
        "blackCards" : [],
        "whiteCards" : []
    }
		}).exec(function(err, success){
			if(err){
				throw err
			}
			res.json(success)
		})
	},

	show: function(req,res){
		let roomID = req.params.id
		console.log(roomID)
		Room.find({id: roomID}).exec(function(err,room){
			if(err){
				return res.json(err)
			} else if (room.length > 0) {
				var getOneRecord = room.pop();
				getOneRecord.title = "YO MOMMA"
				getOneRecord.save(function(err){})
				res.json(getOneRecord)
			}

		})
	}

}
