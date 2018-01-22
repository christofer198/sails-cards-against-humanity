module.exports = {
  fetch: function(userCards){
    var cardObj ="test"
    collect = (cards) => {
       cardObj = "cards"
      //console.log(cardObj)
    }
    Card.find().exec((err, cards) => {
      if(err){
        return err
      }

      let cardObjects = cards[0].whiteCards.filter((card) => {
        for(i=0; i<userCards.length; i++){
          if(card.id==userCards[i]){
            return card
          }
        }
      })

      collect(cardObjects)
      return (cardObj)
    })

  }
}
