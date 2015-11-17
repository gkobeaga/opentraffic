Template.lp_villages.helpers({
	villages: function() {
		return LeftPanelVillages.find({user_id:Meteor.userId()}, {sort: {name: 1}});
	},
});

Template.lp_village.helpers({
	unit_count: function() {
		var self = this;
		var unit_count = 0;
		_.each(s.army.types, function(type) {
			unit_count += self[type];
		});
		return unit_count;
	},

	timeTilFinished: function() {
		var self = this;
		if (this && this.under_construction) {
			Session.get('refresh_time_field')
			var timeToBuild = s.village.cost['level'+(self.level+1)].timeToBuild
			var finishAt = moment(new Date(self.constructionStarted)).add(timeToBuild, 'ms')
			if (moment().isAfter(finishAt)) {
				return 'soon'
			} else {
				return finishAt.fromNow()
			}
		}
	}
});
