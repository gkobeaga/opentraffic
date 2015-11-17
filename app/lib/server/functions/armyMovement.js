Cue.addJob('armyMovementJob', {retryOnError:false, maxMs:1000*60*5}, function(task, done) {
  Moves.find({index:0}).forEach(function(move) {
    var army = Armies.findOne(move.army_id)
    if (army) {
      var army_speed = speed_of_army(army)
      if (moment(new Date(move.last_move_at)).add(army_speed, 'minutes') < moment()) {
        doArmyMove(move, army);
      }
    } else {
      console.error('no army found for move '+move._id);
    }
  });

  done();
});


var doArmyMove = function(move, army) {

  // this is the correct way
  // sometimes doesn't work
  var coords = findNextMoveAlongPath(move, army);

  // if it doesn't work do it this way
  if (!coords) {
    coords = findNextMoveTowardsPath(move, army);
  }

  // make sure it's valid
  if (isNaN(coords.x) || isNaN(coords.y)) {
    console.error('coords '+coords.x+','+coords.y+' not valid. Army '+army._id+' move '+move._id);
    return;
  }

  // move army
  moveArmyToHex(army, coords.x, coords.y);
  Moves.update(move._id, {$set: {last_move_at:new Date()}});

  // is move finished?
  if (coords.x == move.to_x && coords.y == move.to_y) {
    Moves.remove(move._id);

    // update index numbers and last_move_at of other moves
    var i = 0;
    Moves.find({army_id:army._id}, {sort: {index:1}}).forEach(function(m) {
      Moves.update(m._id, {$set: {index:i, last_move_at:new Date()}});
      i++;
    })
  }
}



var findNextMoveAlongPath = function(move, army) {
  var from_pos = Hx.coordinatesToPos(move.from_x, move.from_y, s.hex_size, s.hex_squish);
  var to_pos = Hx.coordinatesToPos(move.to_x, move.to_y, s.hex_size, s.hex_squish);

  // get distance
  var distance = Hx.hexDistance(move.from_x, move.from_y, move.to_x, move.to_y);

  if (distance == 0) {
    return {x:move.to_x, y:move.to_y}
  }

  var foundArmyPosition = false;

  // march along move
  for (i = 0; i <= distance; i++) {
    // pick point along line
    var posX = from_pos.x * (1 - i/distance) + to_pos.x * i/distance;
    var posY = from_pos.y * (1 - i/distance) + to_pos.y * i/distance;

    // find hex at point
    var coords = Hx.posToCoordinates(posX, posY, s.hex_size, s.hex_squish);

    // if army was at previous point, move here
    if (foundArmyPosition) {
      return coords;
    }

    // is this the spot we're at?
    // if so then next time we loop move army
    if (army.x == coords.x && army.y == coords.y) {
      foundArmyPosition = true;
    }
  }

  return null;
}


var findNextMoveTowardsPath = function(move, army) {
  var from_pos = Hx.coordinatesToPos(army.x, army.y, s.hex_size, s.hex_squish);
  var to_pos = Hx.coordinatesToPos(move.to_x, move.to_y, s.hex_size, s.hex_squish);

  var distance = Hx.hexDistance(army.x, army.y, move.to_x, move.to_y);

  if (distance == 0) {
    return {x:move.to_x, y:move.to_y}
  }

  var posX = from_pos.x * (1 - 1/distance) + to_pos.x * 1/distance;
  var posY = from_pos.y * (1 - 1/distance) + to_pos.y * 1/distance;

  var coords = Hx.posToCoordinates(posX, posY, s.hex_size, s.hex_squish);
  return coords;
}



var moveArmyToHex = function(army, x, y) {
  check(x, validNumber);
  check(y, validNumber);

  // move
  Armies.update(army._id, {$set: {
    x:x,
    y:y,
    last_move_at:new Date(),
    'loc.coordinates': [x/100, y/100]
  }});

  // markers
  Markers.update({unitType:'army', unitId:army._id}, {$set:{
    x:x,
    y:y,
    'loc.coordinates': [x/100, y/100]
    }});
  var removeMarkers = false;

  // entering new hex

  var castle = Castles.findOne({x:x, y:y}, {fields: {user_id: 1}});
  var village = Villages.findOne({x:x, y:y}, {fields: {user_id: 1}});
  var armies = Armies.find({x:x, y:y});
  var user = Meteor.users.findOne(army.user_id, {fields:{team:1, lord:1, allies_above:1, allies_below:1, king:1, vassals:1, is_dominus:1}});

  if (!user) {
    console.error('no user found for army '+army._id);
    return;
  }

  if (castle) {
    var castleRelation = getRelationType(user, castle.user_id);
  }

  if (village) {
    var villageRelation = getRelationType(user, village.user_id);
  }


  if (is_stopped(army._id)) {
    var hasMerged = false

    // for alerts
    var joinedCastle = null
    var joinedVillage = null
    var joinedArmy = null

    // merging
    // my castle
    if (castle && castleRelation == 'mine') {
      var inc = {};
      _.each(s.army.types, function(type) {
        inc[type] = army[type]
      });

      Castles.update(castle._id, {$inc:inc});
      removeArmy(army);
      hasMerged = true;
      joinedCastle = castle._id;
    }

    // my village
    if (!hasMerged && village && villageRelation == 'mine') {
      var inc = {};
      _.each(s.army.types, function(type) {
        inc[type] = army[type]
      });

      Villages.update(village._id, {$inc:inc});
      removeArmy(army);
      hasMerged = true;
      joinedVillage = village._id;
    }

    // my army
    if (!hasMerged) {
      armies.forEach(function(otherArmy) {
        if (army._id != otherArmy._id) {
          if (!hasMerged) {

            var relation = getRelationType(user, otherArmy.user_id);
            if (relation == 'mine') {

              // make sure other army is stopped
              if (Moves.find({army_id:otherArmy._id}).count() == 0) {
                var inc = {};
                _.each(s.army.types, function(type) {
                  inc[type] = army[type]
                });

                Armies.update(otherArmy._id, {$inc: inc});
                removeArmy(army);

                // we still need to check for enemies
                // replace unit with combined one
                army = otherArmy;
                hasMerged = true;
                joinedArmy = otherArmy._id;

                // update markers
                Markers.update({unitType:'army', unitId:army._id}, {$set:{unitId:otherArmy._id}}, {multi:true});
              }
            }
          }
        }
      })
    }

    // send alert
    alert_armyFinishedAllMoves(army.user_id, army._id, x, y, joinedCastle, joinedVillage, joinedArmy);

    if (hasMerged) {
      // remove marker
      Markers.remove({unitType:'army', unitId:army._id});
      return;
    }
  }


  // check for ally building for on ally building icon
  if (!hasMerged) {
    var onAllyBuilding = false;

    if (castle) {
      if (castleRelation == 'vassal' || castleRelation == 'direct_vassal') {
        onAllyBuilding = true;
      }
    }

    if (village) {
      if (villageRelation == 'vassal' || villageRelation == 'direct_vassal') {
        onAllyBuilding = true;
      }
    }

    Armies.update(army._id, {$set:{onAllyBuilding:onAllyBuilding}})
  }


  // past moves
  // update army with move
  var pastMoves = army.pastMoves || []
  pastMoves.unshift({x:x, y:y, moveDate:new Date()})
  if (pastMoves.length > s.army.pastMovesToShow) {
    pastMoves.pop()
  }
  Armies.update(army._id, {$set: {pastMoves:pastMoves}});

  // battles
  // so that battle isn't called once for each enemy in hex
  var startBattle = false;

  // check for armies
  armies.forEach(function(otherArmy) {
    if (otherArmy._id != army._id) {
      var someoneIsDominus = false;

      if (user.is_dominus) {
        someoneIsDominus = true;
      } else {
        var otherUser = Meteor.users.findOne(otherArmy.user_id, {fields: {is_dominus:1}});
        if (otherUser.is_dominus) {
          someoneIsDominus = true;
        }
      }

      if (someoneIsDominus) {
        startBattle = true;
      }

      if (!startBattle) {
        var relation = getRelationType(user, otherArmy.user_id);
        if (relation == 'enemy' || relation == 'enemy_ally') {
          startBattle = true;
        }
      }
    }

  })

  // enemy castles
  if (!startBattle) {
    if (castle) {
      if (castleRelation == 'enemy' || castleRelation == 'enemy_ally' || castleRelation == 'lord' || castleRelation == 'direct_lord' || castleRelation == 'king') {
        startBattle = true;
      }
    }
  }

  if (!startBattle) {
    if (village) {
      if (villageRelation == 'enemy' || villageRelation == 'enemy_ally') {
        startBattle = true;
      }
    }
  }

  if (startBattle) {
    Cue.addTask('runBattle', {isAsync:false, unique:true}, {x:x, y:y});
  }
}





is_stopped = function(army_id) {
  check(army_id, String)

  var army = Armies.findOne(army_id, {fields: {x:1, y:1}})
  if (army) {


    var moves = Moves.find({army_id:army._id})
    var count = moves.count()

    if (count == 0) {
      return true
    }

    if (count == 1) {
      var move = moves.fetch()[0]
      if (move) {
        if (army.x == move.to_x && army.y == move.to_y) {
          return true
        }
      }
    }
  }

  return false
}




var removeArmy = function(army) {
  Armies.remove(army._id);
  Moves.remove({army_id:army._id});
  Markers.remove({unitType:'army', unitId:army._id});
}
