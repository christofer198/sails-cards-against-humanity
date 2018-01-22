/**
 * CardController
 *
 * @description :: Server-side logic for managing cards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req,res){
		if(req.method=="GET"){
			Card.find().exec(function(err, cards){
				if(err){
					return res.serverError(err)
				}
				res.json(cards)
			})
		} else if(req.method=="POST"){ //payload should be an array of cards
			let userCards = req.param("cardArray")
			if(userCards){
				Card.find().exec((err, cards) => {
					if(err){
						return res.serverError(err)
					}

					let cardObjects = cards[0].whiteCards.filter((card) => {
						for(i=0; i<userCards.length; i++){
							if(card.id==userCards[i]){
								return card
							}
						}
					})

					res.json(cardObjects)
				})
			}
		}
	}
}
