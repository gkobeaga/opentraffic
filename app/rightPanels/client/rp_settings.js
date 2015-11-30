Session.set("provinces-checkbox", true);
Session.set("roads-checkbox", false);
Session.set("incidents-checkbox", true);

var subs = new ReadyManager()

Template.rp_settings.helpers({

	provinceInfoLoaded: function() {
		return Session.get('rightPanelInfoLoaded');
	},

	provinceGraphsLoaded: function() {
		return Session.get('rightPanelGraphsLoaded');
	},

  tileLAyer: function() {
    if (Session.get('map_tile_source')=='osm') 
      return 'OSM'
    if (Session.get('map_tile_source')=='sat') 
      return 'Satelite'
  },

  toggle_options : function(){
                return {
                    "size": "mini"
                }
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

Template.rp_settings.created = function() {
	var self = this;
	//self.subs = new ReadyManager();

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

Template.rp_settings.events({
    'click #tile-dropdown-osm' : function(event, template) {
      Session.set('map_tile_source','osm')
      console.log('tile-roads')
    },

    'click #tile-dropdown-sat' : function(event, template) {
      Session.set('map_tile_source','sat')
      console.log('tile-roads')
    }
});

