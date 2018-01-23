/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req,res){
		if(req.isSocket) {
			sails.sockets.join(req.socket, 'feed');
			sails.sockets.join(req.socket, "123")
			Room.find().exec(function(err, rooms){
				return res.json(rooms);
			})
		} else{

			Room.find().exec(function(err, room){
				if(err){
					return res.serverError(err)
				}
				res.json(room)
			})
		}

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
		var roomID = req.param("id")

		Room.findOne({id: roomID}).exec(function(err, room){

			let hand;

			if(err){
				res.serverError(err)
			} else if(room.length==0){
				res.status(404).json({error: "Room Not Found"})
			}
			//Adds user to room
			if(room.players.filter((player) => player.userId == req.userId).length === 0){
				room.players.push({userId: req.userId, ready: false, username: req.username})
				//Issues Cards to user
				hand = issueHand()
				room.currentTurn.currentHands.push({userId: req.userId, hand: hand})
			} else{

				hand = room.currentTurn.currentHands.find(hnd => {
					return hnd.userId === req.userId
				})

				hand = hand.hand
			}

			room.save((err) => {
				if(err){
					throw err
				}

				res.json({roomData: room, hand: hand})
			})
		})
	},

	update: function(req,res){

		Room.findOne({id: req.param("roomId")}).exec((err, room) => {
			console.log(room.players)
			room.players.map(player => {
				if(player.userId == req.userId){
					return player.ready = true;
				}
			})

			room.save(err => {
				if(err){
					throw err
				}

				let readyCount = 0
				room.players.map(player => {
					if(player.ready){
						readyCount++
					}
				})

				if(room.players.length > 2 && readyCount/room.players.length > 0.60){
					return res.json({roomReady: "true"})
				}
				return res.json({roomReady: "false"})
			})
		})
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

function issueBlackCard(){
	let hand = 0
	let min = Math.ceil(0);
  let max = Math.floor(90);
	for(i=0; i<1; i++){
		hand = Math.floor(Math.random() * (max - min)) + min
	}
	return hand
}
