Meteor.publish('dailystats_type_hour', function() {
	//if(this.userId) {
      var self = this
      
      var stats = IncidentsHourlystats.aggregate([
          {$group: {
              _id: {
                type : "$type",
                hour_of_day: "$hour_of_day"
              },
              count: {$sum: "$count"}}
          },
          {$project : {
            _id: 0,
            type: "$_id.type",
            hour_of_day: "$_id.hour_of_day",
            count: "$count"}
          }
          ])

          _.each(stats,function(stat) {
              self.added('incidents_dailystats_type_hour', Random.id(), {type: stat.type, hour_of_day : stat.hour_of_day, count : stat.count})
          })

		      this.ready()
	//} else {
	//	this.ready()
	//}
})

Meteor.publish('dailystats_province_hour', function() {
	//if(this.userId) {
      var self = this
      
      var stats = IncidentsHourlystats.aggregate([
          {$group: {
              _id: {
                type : "$type",
                province : "$province"
              },
              count: {$sum: "$count"}}
          },
          {$project : {
            _id: 0,
            type: "$_id.type",
            province : "$_id.province",
            count: "$count"}
          }
          ])

          _.each(stats,function(stat) {
              self.added('incidents_dailystats_province_hour', Random.id(), {type: stat.type, province : stat.province, count : stat.count})
          })

		      this.ready()
	//} else {
		//this.ready()
	//}
})

/*
Meteor.publish('my_dailystats', function() {
	if(this.userId) {
		return Dailystats.find({user_id: this.userId})
	} else {
		this.ready()
	}
})

Meteor.publish('stats_gamestats', function() {
	if(this.userId) {
		return Gamestats.find({}, {fields: {num_users:1, num_active_users:1, created_at:1, soldierWorth:1}})
	} else {
		this.ready()
	}
})

/*
Meteor.publish('my_dailystats', function() {
	if(this.userId) {
		return Dailystats.find({user_id: this.userId})
	} else {
		this.ready()
	}
})

Meteor.publish('stats_gamestats', function() {
	if(this.userId) {
		return Gamestats.find({}, {fields: {num_users:1, num_active_users:1, created_at:1, soldierWorth:1}})
	} else {
		this.ready()
	}
})
*/
