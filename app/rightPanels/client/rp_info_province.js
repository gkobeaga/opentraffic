var subs = new ReadyManager()

Template.rp_info_province.helpers({

	provinceInfoLoaded: function() {
		return Session.get('rightPanelInfoLoaded');
	},

	provinceGraphsLoaded: function() {
		return Session.get('rightPanelGraphsLoaded');
	},

	populationInfo: function(population) {
    var count = 0
    _.each(population,function(data){
      count += data.values[13].value
    })
		return count
	},

	densityInfo: function(population) {
    var count = 0
    _.each(population,function(data){
      count += data.density[13].value
    })
		return round_number_2(count)
	}



})

Template.rp_info_province.created = function() {
	var self = this;
	//self.subs = new ReadyManager();

	Session.set('mouse_mode', 'default');
	//Session.set('update_highlight', Random.fraction());

	self.autorun(function() {

		var selected = Session.get('selected');
			//self.subs.subscriptions([{
			subs.subscriptions([

        {groupName: 'provinceInfo',
          subscriptions: [ Meteor.subscribe('provinceGeoInfo', selected.name),
            Meteor.subscribe('provincePopInfo', selected.name),
            Meteor.subscribe('provinceIncidentsInfo', selected.name)]},

        { groupName: 'provinceGraphs',
				subscriptions: [ Meteor.subscribe('provinceDailystatsGraph', selected.name)]}
      ]);
	});
}

Template.rp_info_province.events({
    'click #closeRpButton': function(event, template) {
        deselect_all();
        //remove_all_highlights();
    }
});

Template.rp_info_province.rendered = function() {
	Session.setDefault('rightPanelInfoLoaded', false);
	Session.setDefault('rightPanelGraphsLoaded', false);

	this.autorun(function() {
		var selected = Session.get('selected');

		if (selected && selected.name && selected.type) {
			switch (selected.type) {
				case 'province':
					Session.set('rightPanelInfoLoaded', subs.ready('provinceInfo'));
					Session.set('rightPanelGraphsLoaded', subs.ready('provinceInfo'));
					console.log(Session.get('rightPanelGraphsLoaded'))

					break;
				case 'road':
					Session.set('rightPanelInfoLoaded', subs.ready('provinceInfo'));
					break;
			}
		}
	})


	this.autorun(function() {
		if (subs.ready('provinceGraphs')) {

		  var selected = Session.get('selected');
		  if (selected && selected.name && selected.type) {
			
			var dStatsDayType = {}	// total income

			_.each(s.incident.types, function(type) {
				dStatsDayType[type] = []
			})

      var now = new Date()

      var days = _.uniq(RightPanelGraphData.find({}, {
        sort: {date: 1}, fields: {date: true}
      }).fetch().map(function(x) {
        return x.date;
      }), true);

     var types =  [ 'accident', 'road_safety', 'roadwork'];

			_.each(types, function(type) {
			  _.each(days, function(day) {
          var count = RightPanelGraphData.find({province:selected.name,type:type,date:day}).fetch()
                        .map(function(stat) {
                          return stat.count
                        })
          dStatsDayType[type].push({x: day, y :count[0]||0})
			  })
      })



			var dDayTypeData = [
				{values: dStatsDayType.accident, key: 'Accidents'},
				{values: dStatsDayType.road_safety, key: 'Road Safety'},
				{values: dStatsDayType.roadwork, key: 'Roadworks'},
				]

			nv.addGraph(function() {
				var chart = nv.models.stackedAreaChart()
            //.rightAlignYAxis(true)
                  .margin({right: 30,left:15})
                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                  .duration(300)
                  .showControls(true)     //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                  .clipEdge(true);

            //Format x-axis labels with custom function.
            chart.xAxis
              .tickFormat(function(d) { 
                return d3.time.format('%m/%d')(new Date(d)) 
              });
            chart.yAxisTickFormat(d3.format(',.0d'));

            chart.legend.margin({top: 2,right:90})
            chart.controls.margin({top: 2,right:180})



		      d3.select('#yearChart svg')
            .datum(dDayTypeData)
            .call(chart);

				nv.utils.windowResize(chart.update)
				return chart
			})

		}

		}
	})
}
