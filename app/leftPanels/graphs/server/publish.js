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

		      self.ready()
	//} else {
	//	this.ready()
	//}
})

Meteor.publish('weekdaystats', function() {
	//if(this.userId) {
  //
		return IncidentsWeekDaystats.find()
   
	//} else {
		//this.ready()
	//}
})

Meteor.publish('monthlystats', function() {
	//if(this.userId) {
  //
		return IncidentsMonthlyStats.find()
   
	//} else {
		//this.ready()
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

