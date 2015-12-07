var incidents_fields = {type:1, road:1, sense:1, town:1, latitude:1, longitude:1, cause:1, start_date_time:1}


Meteor.publish('realtime_incidents_map', function() {

	var self = this

	//if(this.userId) {
  //console.log('Baiii')
		//return IncidentsRealTime.find({},{ fields:incidents_fields})
		//console.log(IncidentsRealTime.find({}))
		var cur = IncidentsRealTime.find({type:{$in : ['accident','road_safety','roadwork']}})

      Mongo.Collection._publishCursor(cur, self, 'incidents_realtime_map')
      return self.ready();
	//} else {
	//	this.ready()
	//}
})

Meteor.publish('map_roads', function() {

		return Roads.find();

})

Meteor.publish('map_provinces', function() {

		return Provinces.find();

})

Meteor.publish('map_grid', function(query) {

		return Grids.find(query);

})


Meteor.publish('map_density', function(query) {
		return Density.find(query);

})
