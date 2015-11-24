var subs = new ReadyManager()

Template.rp_info_province.helpers({

	provinceInfoLoaded: function() {
		return Session.get('rightPanelInfoLoaded');
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
			subs.subscriptions([{
				groupName: 'provinceInfo',
				subscriptions: [ Meteor.subscribe('provinceGeoInfo', selected.name),
                         Meteor.subscribe('provincePopInfo', selected.name),
                         Meteor.subscribe('provinceIncidentsInfo', selected.name)
        ]
			} ]);
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
	this.autorun(function() {
		var selected = Session.get('selected');

		if (selected && selected.name && selected.type) {
			switch (selected.type) {
				case 'province':
					Session.set('rightPanelInfoLoaded', subs.ready('provinceInfo'));
					break;
				case 'road':
					var infoHandle = Meteor.subscribe('armyForHexInfo', selected.name);
					Session.set('rightPanelInfoLoaded', infoHandle.ready());
					break;
			}
		}
	})
}
