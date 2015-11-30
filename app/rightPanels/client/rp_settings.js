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
    'click #tile-dropdown-roads' : function(event, template) {
      console.log('tile-roads')
    }
});

