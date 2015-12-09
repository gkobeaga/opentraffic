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

