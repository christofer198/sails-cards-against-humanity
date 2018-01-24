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
		"roomData": {
			"roomReady": false,
	    "players" : [],
	    "currentTurn" : {
				"userId": null,
				"blackCard": null,
				"pick": null,
				"pickedCards": [],
				"currentHands":[]
			},
	    "graveYard" : {
				"blackCards": [],
				"whiteCards": []
			}
		}
	}).exec(function(err, newRoom){
			if(err){
				return res.serverError(err)
			}
			res.json(newRoom)
		})
	},

	subscribe: function(req, res){
		if(req.isSocket){

			let reqParam = req.allParams()
			Room.subscribe(req, [reqParam["roomID"]])

			Room.findOne({id: reqParam["roomID"]}).exec(function(err, room){

				let hand;

				if(err){
					res.serverError(err)
				} else if(room.length==0){
					res.status(404).json({error: "Room Not Found"})
				}
				//Adds user to room
				if(room.roomData.players.filter((player) => player.userId == req.userId).length === 0){
					room.roomData.players.push({userId: req.userId, ready: false, username: req.username, score: 0})
					//Issues Cards to user
					hand = issueHand()
					room.roomData.currentTurn.currentHands.push({userId: req.userId, hand: hand})
				} else{

					hand = room.roomData.currentTurn.currentHands.find(hnd => {
						return hnd.userId === req.userId
					})

					hand = hand.hand
				}

				room.save((err) => {
					if(err){
						throw err
					}
					Room.publishUpdate(room.id, room)
					//res.json({roomData: room, hand: hand})
				})
			})
		} else{
			return res.json({error: "Not a socket"})
		}
	},

	submit: function(req, res){

		let roomParams = req.param("room")
		//console.log(roomParams)
		Room.findOne({id: roomParams.id}).exec(function(err, room){
			room.roomData = roomParams.roomData
			room.save(err => {
				if(err){
					throw err
				}

				if(req.headers.roomupdate === 'UPDATECARD'){
					Room.publishUpdate(room.id, room)
					res.ok()
				} else if(req.headers.roomupdate === 'ROOMSUBMIT'){

					Card.find().exec((err, cards) => {
						let blackCard = cards[0].blackCards.filter((card) => {
							if(card.id==roomParams.roomData.currentTurn.blackCard){
								return card
							}
						})

						// let blackCard = cards.blackCards[roomParams.roomData.currentTurn.blackCard]
						roomParams.roomData.currentTurn.blackCard = blackCard[0].text//Change to random
						roomParams.roomData.currentTurn.pick = blackCard[0].pick
						room.roomData = roomParams.roomData
						room.save(err => {
							Room.publishUpdate(roomParams.id, room)
							res.ok()
						})
					})
				}
			})
		})
		// if(req.isSocket){
		// 	let roomID = req.allParams()["roomID"]
		// 	let userID = req.allParams()["roomID"]
		// 	let pickedCards = req.allParams()["pickedCards"]
		// 	Room.findOne({id: roomID}).exec((err, room) => {
		// 		room.currentTurn.pickedCards.push({userId: req.userId, pickedCards:pickedCards})
		// 		room.currentTurn.currentHands.map(userHand => {
		// 			if(userHand.id == req.userId){
		// 				_.pullAll(userHand.hand, pickedCards)
		// 			}
		// 		})
		// 		room.save(err => {
		// 			if(err){
		// 				throw err
		// 			}
		// 			Room.publishUpdate(room.id, room)
		// 		})
		// 	})
		// }else{
		// 	res.serverError("not a socket")
		// }
	},

	update: function(req,res){

		Room.findOne({id: req.param("roomId")}).exec((err, room) => {

			room.roomData.players.map(player => {
				if(player.userId == req.userId){
					return player.ready = true;
				}
			})

			room.save(err => {
				if(err){
					throw err
				}

				let readyCount = 0
				room.roomData.players.map(player => {
					if(player.ready){
						readyCount++
					}
				})
				if(room.roomData.players.length > 1 && readyCount/room.roomData.players.length > 0.60 && !room.roomData.roomReady){
					room.roomData.currentTurn.userId = room.roomData.players[_.random(0, room.roomData.players.length-1)].userId //Change to random
					room.roomData.roomReady = true
					Card.find().exec((err, cards) => {
						let rand = _.random(1,89)
						let blackCard = cards[0].blackCards.filter((card) => {
							if(card.id==rand){
								return card
							}
						})
						console.log(blackCard)
						room.roomData.currentTurn.blackCard = blackCard[0].text//Change to random
						room.roomData.currentTurn.pick = blackCard[0].pick
						room.save(err => {
							Room.publishUpdate(room.id, room)
						})
					})
				}
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
