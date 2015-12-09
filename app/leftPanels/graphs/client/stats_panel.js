var subs = new ReadyManager()

Template.stats_panel.created = function() {
	this.autorun(function() {
		subs.subscriptions([{
			groupName:'stats',
			subscriptions: [
				Meteor.subscribe('dailystats_type_hour').ready(),
				Meteor.subscribe('monthlystats').ready(),
				Meteor.subscribe('weekdaystats').ready(),
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
			
			var dStatsHourType = {}
			var monthlyStats = {}
			var weekDayStats = {}
			var dStatsProvinceType = {}	

			_.each(s.incident.types, function(type) {
				dStatsHourType[type] = []
				dStatsProvinceType[type] = []
				weekDayStats[type] = []
				monthlyStats[type] = []
			})

      var hours = _.range(0,24)

        _.each(hours, function(hour) {
			_.each(s.incident.types, function(type) {

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
				{values: dStatsHourType.accident, key: 'Accidents'},
				{values: dStatsHourType.road_safety, key: 'Road Safety'},
				{values: dStatsHourType.roadwork, key: 'Roadworks'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
              //.reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
              //.rotateLabels(0)      //Angle to rotate x-axis labels.
              .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
              //.groupSpacing(0.1);    //Distance between each group of bars.
              //.duration(300);

        chart.xAxis
          .tickFormat(d3.format(',f'));

        chart.yAxis
          .tickFormat(d3.format(',f'));

        chart.stacked(true)

				d3.select('#hourlyChart svg')
          .datum(dHourTypeData)
          //.duration(500)
          .call(chart);

				nv.utils.windowResize(chart.update)
				return chart
			})

      var days = _.range(1,8)

			_.each(s.incident.types, function(type) {
        _.each(days, function(day) {

          var count = IncidentsWeekDaystats.find({type:type,day_of_week:day}).fetch()
                      .map(function(stat) {return stat.count})
          weekDayStats[type].push({x:day,y:count})
        })
			})

			var weekDayStatsData = [
				{values: weekDayStats.accident, key: 'Accidents'},
				{values: weekDayStats.road_safety, key: 'Road Safety'},
				{values: weekDayStats.roadwork, key: 'Roadworks'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
            .showLegend(true)
            //.duration(300)
            //.groupSpacing(0.1)
        chart.reduceXTicks(false).staggerLabels(true);
        

        chart.stacked(true)

				d3.select('#weekDayChart svg')
          .datum(weekDayStatsData)
          .call(chart)

				nv.utils.windowResize(chart.update)
				return chart
			})

      var months = _.range(1,13)

			_.each(s.incident.types, function(type) {
        _.each(months, function(month) {
          console.log(IncidentsMonthlyStats.find({type:type, month:month}).fetch())

          var count = IncidentsMonthlyStats.find({type:type,month:month}).fetch()
                      .map(function(stat) {return stat.count})
          monthlyStats[type].push({x:month,y:count})
        })
			})

			var monthlyStatsData = [
				{values: monthlyStats.accident, key: 'Accidents'},
				{values: monthlyStats.road_safety, key: 'Road Safety'},
				{values: monthlyStats.roadwork, key: 'Roadworks'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
            .showLegend(true)
            //.duration(300)
            //.groupSpacing(0.1)
        chart.reduceXTicks(false).staggerLabels(true);
        

        chart.stacked(true)

				d3.select('#monthlyChart svg')
          .datum(monthlyStatsData)
          .call(chart)

				nv.utils.windowResize(chart.update)
				return chart
			})

			var dProvinceTypeData = [
				{values: dStatsProvinceType.accident, key: 'Accidents'},
				{values: dStatsProvinceType.road_safety, key: 'Road Safety'},
				{values: dStatsProvinceType.roadwork, key: 'Roadworks'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
            .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
            //.duration(300)

        chart.stacked(true)

				d3.select('#byProvincesChart svg')
          .datum(dProvinceTypeData)
          .call(chart)

				nv.utils.windowResize(chart.update)
				return chart
			})

		}
	})
}
