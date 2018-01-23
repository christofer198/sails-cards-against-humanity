/**
 * Room.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // toJSON: function(){
    //   let obj = this.toObject()
    //   delete obj.currentTurn.currentHands
    //   return obj
    // }
  },

  afterCreate: function(entry, cb) {
    sails.sockets.broadcast('feed', 'new_entry', entry);
    cb();
  },

  connection: 'someMongodbServer'
};

// id: 1,
// title: "Sample Room",
// players: [{userId: 1, score: 0}, {userId: 2, score: 0}, {userId: 3, score: 0}],
// currentTurn: {
//   userId: 2,
//   blackCard: 2,
//   pickedCards: {
//     1: [14],
//     3: [3]
//   },
//   currentHands: {
//     1: [7,8,9,10,11],
//     2: [12,20,21,22,23],
//     3: [1,2,30,31,32]
//   }
// },
// graveYard: {
//   blackCards: [1],
//   whiteCards: [6]
// }
// }
