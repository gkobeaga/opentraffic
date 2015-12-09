Template.menu.helpers({
	smallScreen: function() {
		var screenWidth = Session.get('screenWidth');
		if (screenWidth) {
			return Session.get('screenWidth') < 800;
		}
	},


	alerts_active: function() {
		if (Session.get('show_alerts_panel')) { return 'active' } else { return '' }
	},

	stats_active: function() {
		if (Session.get('show_stats_panel')) { return 'active' } else { return '' }
	},


	help_active: function() {
		if (Session.get('show_help_panel')) { return 'active' } else { return '' }
	}

	})


Template.menu.events({
	'click #show_alerts_panel_button': function(event, template) {
		if (Session.get('show_alerts_panel')) {
			Session.set('show_alerts_panel', false)
		} else {
			Session.set('show_alerts_panel', true)
		}
	},

	'click #show_help_panel_button': function(event, template) {
		if (Session.get('show_help_panel')) {
			Session.set('show_help_panel', false)
		} else {
			Session.set('show_help_panel', true)
		}
	},

	'click #show_stats_panel_button': function(event, template) {
		if (Session.get('show_stats_panel')) {
			Session.set('show_stats_panel', false)
		} else {
			Session.set('show_stats_panel', true)
		}
	}

})



Template.menu.rendered = function() {
	Session.setDefault('show_help_panel', false)
	Session.setDefault('show_alerts_panel', false)
	Session.setDefault('show_stats_panel', false)

}
