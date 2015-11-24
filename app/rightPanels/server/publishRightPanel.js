var castle_fields = {name:1, user_id:1, x:1, y:1, username:1, image:1}
var army_fields = {name:1, user_id:1, x:1, y:1, last_move_at:1, username:1, castle_x:1, castle_y:1, castle_id:1}
var village_fields = {
	name:1,
	user_id:1,
	x:1,
	y:1,
	username:1,
	castle_x:1,
	castle_y:1,
	castle_id:1,
	income:1,
	under_construction:1,
	created_at:1,
	level:1,
	constructionStarted:1
}

_.each(s.army.types, function(type) {
	castle_fields[type] = 1
	army_fields[type] = 1
	village_fields[type] = 1
})


Meteor.publish('rightPanelUser', function(user_id) {
	if(this.userId) {
		var sub = this
		var fields = {
			username:1,
			lord:1,
			x:1,
			y:1,
			castle_id:1,
			num_allies_below:1,
			allies_above:1,
			allies_below:1,
			is_dominus:1,
			is_king:1,
			income:1,
			"net.total":1,
			losses_num:1,
			"emails.verified":1,
			specialization:1,
			specializationChanging:1,
			specializationChangeStarted:1
			}
		var cur = Meteor.users.find(user_id, {fields: fields})
		Mongo.Collection._publishCursor(cur, sub, 'rightPanelUser')
		return sub.ready()
	} else {
		this.ready()
	}
})

Meteor.publish('provinceGeoInfo', function(province) {
		var sub = this
		var cur = GeoInfo.find({province:province})
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_geo_info')
		return sub.ready()
})

Meteor.publish('provincePopInfo', function(province) {
		var sub = this
		var cur = Population.find({province:province})
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_pop_info')
		return sub.ready()
})

Meteor.publish('provinceIncidentsInfo', function(province) {
		var sub = this

    var stats = IncidentsDailystats.find({province:province})

    var accident_count = 0,
        road_safety_count = 0,
        roadworks_count = 0

    stats.forEach(function(stat) {
      if (stat.type == 'accident' ) 
        accident_count += stat.count
      else if (stat.type == 'road_safety' ) 
        road_safety_count += stat.count
      else if (stat.type == 'roadwork' ) 
        roadworks_count += stat.count
    })

      sub.added('right_panel_incidents_info', Random.id(), 
                { accidents : accident_count,
                  road_safety   : road_safety_count,
                  roadworks : roadworks_count
      })

		return sub.ready()
})

Meteor.publish('armyForHexInfo', function(id) {
	if(this.userId) {
		var sub = this
		var cur = Armies.find(id, {fields:army_fields})
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_armies')
		return sub.ready()
	} else {
		this.ready()
	}
})

Meteor.publish('villageForHexInfo', function(id) {
	if(this.userId) {
		var sub = this
		var cur = Villages.find(id, {fields:village_fields})
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_villages')
		return sub.ready()
	} else {
		this.ready()
	}
})


Meteor.publish('rightPanelTree', function(user_id) {
	if(this.userId && user_id != this.userId) {
		var sub = this

		var user = Meteor.users.findOne(user_id, {fields: {allies_above:1}})
		if (user) {
			var fields = {name:1, x:1, y:1, castle_id:1, lord:1, username:1}

			var cur = Meteor.users.find({_id: {$in:user.allies_above}}, {fields: fields})
			Mongo.Collection._publishCursor(cur, sub, 'rightPanelTreeUsers')
		}

		return sub.ready()
	} else {
		this.ready()
	}
})
