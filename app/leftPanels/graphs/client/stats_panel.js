var subs = new ReadyManager()

Template.stats_panel.created = function() {
	this.autorun(function() {
		subs.subscriptions([{
			groupName:'stats',
			subscriptions: [
				//Meteor.subscribe('incidents_dailystats').ready(),
				Meteor.subscribe('dailystats_type_hour').ready(),
				Meteor.subscribe('dailystats_province_hour').ready()//,
				//Meteor.subscribe('stats_gamestats').ready()
				]
		}])
	})
}


Template.stats_panel.rendered = function() {
	var self = this

	this.firstNode.parentNode._uihooks = leftPanelAnimation

	this.autorun(function() {
		if (subs.ready('stats')) {
			
      var dTypeHour = DailystatsTypeHour.find({}, {sort: {hour_of_day: 1}})
      var dProvinceHour = DailystatsProvinceHour.find({})

			var dStatsTypeHour = {}	// total income
			var dStatsProvinceHour = {}	// total income

			//var networthValues = []
			//var incomeRankValues = []
			//var numVassalsValues = []

			_.each(s.incident.types, function(type) {
				dStatsTypeHour[type] = []
				dStatsProvinceHour[type] = []
			})

      var hours = _.range(24)

			dTypeHour.forEach(function(stat) {
          dStatsTypeHour[stat.type].push({x:stat.hour_of_day,y:stat.count})
			})

			dProvinceHour.forEach(function(stat) {
          dStatsProvinceHour[stat.type].push({x:stat.province,y:stat.count})
			})

			var dTypeHourData = [
				{values: dStatsTypeHour.accident, key: 'Accidents', color: '#82d957'},
				{values: dStatsTypeHour.road_safety, key: 'Road Safety', color: '#b3823e'},
				{values: dStatsTypeHour.roadwork, key: 'Roadworks', color: '#d9d9d9'},
				{values: dStatsTypeHour.other_incidents, key: 'Other Incidents', color: '#5793d9'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
            //.barColor(d3.scale.category20().range())
            //.useInteractiveGuideline(true)
            .rightAlignYAxis(true)
            .showLegend(true)
            .duration(300)
            //.margin({bottom: 100, left: 70})
            .groupSpacing(0.1)
            //.showControls(true)
            //.showYAxis(true)
            //.showXAxis(true)
        chart.reduceXTicks(false).staggerLabels(true);

				//chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
				//chart.xAxis.tickFormat(d3.format(",f"))
				//chart.yAxis.tickFormat(d3.format(",.0f"))

				d3.select('#incChart svg')
          .datum(dTypeHourData)
          .call(chart)

				nv.utils.windowResize(chart.update)
				return chart
			})

      /*
			var dProvinceHourData = [
				{values: dStatsProvinceHour.accident, key: 'Accidents'},
				{values: dStatsProvinceHour.road_safety, key: 'Road Safety'},
				{values: dStatsProvinceHour.roadwork, key: 'Roadworks'},
				{values: dStatsProvinceHour.other_incidents, key: 'Other Incidents'}
				]
*/
			var dProvinceHourData = [
				{values: dStatsProvinceHour.accident, key: 'Accidents', color: '#82d957'},
				{values: dStatsProvinceHour.road_safety, key: 'Road Safety', color: '#b3823e'},
				{values: dStatsProvinceHour.roadwork, key: 'Roadworks', color: '#d9d9d9'},
				{values: dStatsProvinceHour.other_incidents, key: 'Other Incidents', color: '#5793d9'}
				]

			nv.addGraph(function() {
				var chart = nv.models.multiBarChart()
            //.barColor(d3.scale.category20().range())
            //.useInteractiveGuideline(true)
            //.rightAlignYAxis(true)
            //.showLegend(true)
            //.staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.

            //.tooltips(false)        //Don't show tooltips
            //.showValues(true)
            .duration(300)
            //.margin({bottom: 100, left: 70})
            //.groupSpacing(0.1)
            //.showControls(true)
            //.showYAxis(true)
            //.showXAxis(true)
        //chart.reduceXTicks(false).staggerLabels(true);

				//chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
				//chart.xAxis.tickFormat(d3.format(",f"))
				//chart.yAxis.tickFormat(d3.format(",.0f"))

				d3.select('#buildingIncChart svg')
          .datum(dProvinceHourData)
          .call(chart)

				nv.utils.windowResize(chart.update)
				return chart
			})



      /*

			var incomeRankData = [{values: incomeRankValues, key: 'Income Rank', color: '#e6d545'}]

			nv.addGraph(function() {
				var chart = nv.models.lineChart().useInteractiveGuideline(true).showLegend(true).showYAxis(true).showXAxis(true)
				.yDomain([d3.max(incomeRankValues, function(d) { return d.y }),1])
				chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
				chart.yAxis.tickFormat(d3.format(",.0f"))
				d3.select('#rankIncomeChart svg').datum(incomeRankData).transition().duration(300).call(chart)
				nv.utils.windowResize(chart.update)
				return chart
			})





			var num_allies_data = [
			{values: numVassalsValues, key: 'Vassals', color: '#5793d9'},
			]

			nv.addGraph(function() {
				var chart = nv.models.lineChart().useInteractiveGuideline(true).showLegend(true).showYAxis(true).showXAxis(true)
				chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
				chart.yAxis.tickFormat(d3.format(",.0f"))
				d3.select('#num_allies_chart svg').datum(num_allies_data).transition().duration(300).call(chart)
				nv.utils.windowResize(chart.update)
				return chart
			})
		}
	})


	this.autorun(function() {
		if (subs.ready('stats')) {
			var gamestats = Gamestats.find({}, {sort:{created_at:1}})

			var numUsers = []
			var numActiveUsers = []

			var soldierWorth = {}
			_.each(s.army.types, function(type) {
				soldierWorth[type] = []
			})

			gamestats.forEach(function(stat) {
				if (stat.num_users && !isNaN(stat.num_users)) {
					numUsers.push({x:stat.created_at, y:stat.num_users})
				}

				if (stat.num_active_users && !isNaN(stat.num_active_users)) {
					numActiveUsers.push({x:stat.created_at, y:stat.num_active_users})
				}

				if (stat.soldierWorth) {
					_.each(s.army.types, function(type) {
						if (!isNaN(stat.soldierWorth[type])) {
							soldierWorth[type].push({x:stat.created_at, y:stat.soldierWorth[type]})
						}
					})
				}
			})

			var user_data = [
				{values: numUsers, key: 'Total Players', color: '#82d957'},
				{values: numActiveUsers, key: 'Active Players', color: '#5793d9'}
			]

			nv.addGraph(function() {
				var chart = nv.models.lineChart().useInteractiveGuideline(true).showLegend(true).showYAxis(true).showXAxis(true)
				.yDomain([0, d3.max(numUsers, function(d) { return d.y })])
				chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
				chart.yAxis.tickFormat(d3.format(",.0f"))
				d3.select('#users_chart svg').datum(user_data).transition().duration(300).call(chart)
				nv.utils.windowResize(chart.update)
				return chart
			})



			// soldier worth
			var soldierColors = [
				'#e6d545',
				'#82d957',
				'#d9d9d9',
				'#5793d9',
				'#d98659',
				'#d9cf82'
			]
			var soldierWorthData = []
			var x = 0
			_.each(s.army.types, function(type) {
				soldierWorthData.push({
					values: soldierWorth[type],
					key: type,
					color: soldierColors[x]
				})
				x++
			})

			nv.addGraph(function() {
				var chart = nv.models.lineChart().useInteractiveGuideline(true).showLegend(true).showYAxis(true).showXAxis(true)
				chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
				chart.yAxis.tickFormat(d3.format(",.0f"))
				d3.select('#soldierWorthChart svg').datum(soldierWorthData).transition().duration(300).call(chart)
				nv.utils.windowResize(chart.update)
				return chart
			})
      */


		}
	})
}
