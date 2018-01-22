/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req,res){
		Room.find().exec(function(err, room){
			if(err){
				return res.serverError(err)
			}
			res.json(room)
		})
	},

	create: function(req,res){
		Room.create({
    "title" : req.param("roomName"),
    "players" : [],
    "currentTurn" : {
			"userId": null,
			"blackCard": null,
			"pickedCards": [],
			"currentHands":[]
		},
    "graveYard" : {
			"blackCards": [],
			"whiteCards": []
		}
	}).exec(function(err, newRoom){
			if(err){
				return res.serverError(err)
			}
			res.json(newRoom)
		})
	},

	show: function(req,res){
		let roomID = req.param("id")

		Room.findOne({id: roomID}).exec(function(err, room){
			let hand;

			if(err){
				res.serverError(err)
			} else if(room.length==0){
				res.status(404).json({error: "Room Not Found"})
			}
			//Adds user to room
			if(room.players.filter((player) => player.userId == req.param("userId")).length == 0){
				room.players.push({userId: req.param("userId")})
				//Issues Cards to user
				hand = issueHand()
				room.currentTurn.currentHands.push({userId: req.param("userId"), hand: hand})
			} else{
				//Retrieves Cards if user is returning
			 	hand = room.currentTurn.currentHands.filter(hand => {
					if(hand.userId == req.param){
						return hand
					}
				})
			}

			room.save((err) => {
				if(err){
					throw err
				}
				res.json({roomData: room, hand: hand})
			})

		})
		// Room.find({id: roomID}).exec(function(err,room){
		// 	if(err){
		// 		return res.json(err)
		// 	} else if (room.length > 0) {
		// 		res.json(room)
		// 	}
		// })
	}

}

function issueHand(){
	let hand = []
	let min = Math.ceil(0);
  let max = Math.floor(460);
	for(i=0; i<5; i++){
		hand.push(Math.floor(Math.random() * (max - min)) + min)
	}
	return hand
}
