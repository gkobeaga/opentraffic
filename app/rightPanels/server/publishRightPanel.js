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
		var cur = Population.find({province:province},{fields: {percentages:0}})
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_pop_info')
		return sub.ready()
})

Meteor.publish('provinceIncidentsInfo', function(province) {
		var sub = this

    var stats = IncidentsHourlystats.find({province:province}, {fields: {type:1,count:1}})

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


Meteor.publish('provinceDailystatsGraph', function(province) {

    var now = new Date();
		var sub = this
    var types =  [ 'accident', 'road_safety', 'roadwork'];
		var cur = IncidentsDailystats.find({
      date: {$gte: moment(new Date(now - 1000*60*60*24*40)).valueOf()},
      type: {$in: types},
      count: {$lt: 50},
      province:province
    })
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_graph_data')
		return sub.ready()

})





Meteor.publish('stateGeoInfo', function(state) {
		var sub = this
		var cur = GeoInfo.find({state:state})
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_geo_info')
		return sub.ready()
})

Meteor.publish('statePopInfo', function(state) {
		var sub = this
		var cur = Population.find({state:state})
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_pop_info')
		return sub.ready()
})

Meteor.publish('stateIncidentsInfo', function(state) {
		var sub = this

    var stats = IncidentsHourlystats.find()

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


Meteor.publish('stateDailystatsGraph', function(state) {

    var now = new Date();
		var sub = this
    var types =  [ 'accident', 'road_safety', 'roadwork'];
		var cur = IncidentsDailystats.find({
      date: {$gte: moment(new Date(now - 1000*60*60*24*40)).valueOf()},
      type: {$in: types},
      count: {$lt: 50}
    })
		Mongo.Collection._publishCursor(cur, sub, 'right_panel_graph_data')
		return sub.ready()

})

