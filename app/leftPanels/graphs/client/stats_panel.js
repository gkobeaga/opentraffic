var subs = new ReadyManager()

Template.stats_panel.created = function() {
	this.autorun(function() {
		subs.subscriptions([{
			groupName:'stats',
			subscriptions: [
				Meteor.subscribe('dailystats_type_hour').ready(),
				Meteor.subscribe('dailystats_province_hour').ready()
				]
		}])
	})
}


Template.stats_panel.rendered = function() {
	var self = this

	this.firstNode.parentNode._uihooks = leftPanelAnimation

	this.autorun(function() {
		if (subs.ready('stats')) {
			
			var dStatsHourType = {}	// total income
			var dStatsProvinceType = {}	// total income

			_.each(s.incident.types, function(type) {
				dStatsHourType[type] = []
				dStatsProvinceType[type] = []
			})

      var now = new Date()
      var hours = _.range(now.getHours()+1,now.getHours() +25)
                   .map(function(hour) {return hour %24})

      console.log(hours)
			_.each(s.incident.types, function(type) {
        _.each(hours, function(hour) {
      console.log(hour)

          var count = DailystatsTypeHour.find({type:type,hour_of_day:hour}).fetch()
                      .map(function(stat) {return stat.count})
          dStatsHourType[type].push({x:hour,y:count})
        })
			})


			_.each(s.incident.types, function(type) {
        _.each(s.province.types, function(province) {

          var count = DailystatsProvinceHour.find({type:type,province:province}).fetch()
                      .map(function(stat) {return stat.count})
          dStatsProvinceType[type].push({x:province,y:count})
        })
			})

			var dHourTypeData = [
				{values: dStatsHourType.accident, key: 'Accidents', color: '#82d957'},
				{values: dStatsHourType.road_safety, key: 'Road Safety', color: '#b3823e'},
				{values: dStatsHourType.roadwork, key: 'Roadworks', color: '#d9d9d9'},
				{values: dStatsHourType.other_incidents, key: 'Other Incidents', color: '#5793d9'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
            .rightAlignYAxis(true)
            .showLegend(true)
            .duration(300)
            .groupSpacing(0.1)
        chart.reduceXTicks(false).staggerLabels(true);


				d3.select('#incChart svg')
          .datum(dHourTypeData)
          .call(chart)

				nv.utils.windowResize(chart.update)
				return chart
			})

			var dProvinceTypeData = [
				{values: dStatsProvinceType.accident, key: 'Accidents', color: '#82d957'},
				{values: dStatsProvinceType.road_safety, key: 'Road Safety', color: '#b3823e'},
				{values: dStatsProvinceType.roadwork, key: 'Roadworks', color: '#d9d9d9'},
				{values: dStatsProvinceType.other_incidents, key: 'Other Incidents', color: '#5793d9'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
            .duration(300)

				d3.select('#buildingIncChart svg')
          .datum(dProvinceTypeData)
          .call(chart)

				nv.utils.windowResize(chart.update)
				return chart
			})

		}
	})
}
