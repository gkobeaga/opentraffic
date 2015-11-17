Template.menu.helpers({
	smallScreen: function() {
		var screenWidth = Session.get('screenWidth');
		if (screenWidth) {
			return Session.get('screenWidth') < 800;
		}
	},

	numUnreadAlerts: function() {
		return UnreadAlerts.find().count();
	},

	alerts_active: function() {
		if (Session.get('show_alerts_panel')) { return 'active' } else { return '' }
	},

	stats_active: function() {
		if (Session.get('show_stats_panel')) { return 'active' } else { return '' }
	},

	settings_active: function() {
		if (Session.get('show_settings_panel')) { return 'active' } else { return '' }
	},

	help_active: function() {
		if (Session.get('show_help_panel')) { return 'active' } else { return '' }
	},

	isNewForumPost: function() {
		if (Session.get('forumTemplate') == 'forumList') {
			return false;
		}

		// posts older than two weeks are not new
		var cutoff = moment().subtract(2, 'weeks');
		var postDate = moment(new Date(this.createdAt));
		if (postDate.isBefore(cutoff)) {
			return false;
		}

		var lastPostDate = Forumlatestpost.findOne();
		if (lastPostDate) {
			var lastPost = moment(new Date(lastPostDate.latestPost));
			var viewedForumList = Cookie.get('forumList');
			if (moment(new Date(viewedForumList)).isBefore(lastPost)) {
				return true;
			}
		}
	}})


Template.menu.events({
	'click #show_summary_panel_button': function(event, template) {
		event.preventDefault()
		if (Session.get('show_summary_panel')) {
			Session.set('show_summary_panel', false)
		} else {
			Session.set('show_summary_panel', true)
		}
	},

	'click #show_admin_panel_button': function(event, template) {
		if (Session.get('show_admin_panel')) {
			Session.set('show_admin_panel', false)
		} else {
			Session.set('show_admin_panel', true)
		}
	},

	'click #show_market_panel_button': function(event, template) {
		if (Session.get('show_market_panel')) {
			Session.set('show_market_panel', false)
		} else {
			Session.set('show_market_panel', true)
		}
	},

	'click #show_settings_panel_button': function(event, template) {
		if (Session.get('show_settings_panel')) {
			Session.set('show_settings_panel', false)
		} else {
			Session.set('show_settings_panel', true)
		}
	},

	'click #show_chatrooms_panel_button': function(event, template) {
		if (Session.get('show_chatrooms_panel')) {
			Session.set('show_chatrooms_panel', false)

			var selectedChatroomId = Session.get('selectedChatroomId');
			if (selectedChatroomId) {
				var date = new Date()
				Cookie.set('room_'+selectedChatroomId+'_open', moment(date).add(1, 's').toDate(), {years: 10});
			}

		} else {
			Session.set('show_chatrooms_panel', true)
		}
	},

	'click #showForumsButton': function(event, template) {
		if (Session.get('showForumsPanel')) {
			Session.set('showForumsPanel', false)
			Cookie.set('forum_close', new Date(), {years: 10})
		} else {
			Session.set('showForumsPanel', true)
			Cookie.clear('forum_close')
		}
	},

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
	},

	'click #show_rankings_panel_button': function(event, template) {
		if (Session.get('show_rankings_panel')) {
			Session.set('show_rankings_panel', false)
		} else {
			Session.set('show_rankings_panel', true)
		}
	},


	'click #show_tree_panel_button': function(event, template) {
		if (Session.get('show_tree_panel')) {
			Session.set('show_tree_panel', false)
		} else {
			Session.set('show_tree_panel', true)
		}
	},


	'click #calcPanelButton': function(event, template) {
		if (Session.get('showCalcPanel')) {
			Session.set('showCalcPanel', false);
		} else {
			Session.set('showCalcPanel', true);
		}
	},

	'click #markersPanelButton': function(event, template) {
		if (Session.get('showMarkersPanel')) {
			Session.set('showMarkersPanel', false);
		} else {
			Session.set('showMarkersPanel', true);
		}
	}
})



Template.menu.rendered = function() {
	Session.setDefault('show_summary_panel', false)
	Session.setDefault('show_help_panel', false)
	Session.setDefault('show_alerts_panel', false)
	Session.setDefault('show_admin_panel', false)
	Session.setDefault('show_settings_panel', false)
	Session.setDefault('showForumsPanel', false)
	Session.setDefault('show_chatrooms_panel', false)
	Session.setDefault('show_rankings_panel', false)
	Session.setDefault('show_stats_panel', false)
	Session.setDefault('show_tree_panel', false)
	Session.setDefault('showCalcPanel', false);
	Session.setDefault('show_coords', false)

	this.autorun(function() {
		Meteor.subscribe('unreadAlerts')
		Meteor.subscribe('room_list')
		Meteor.subscribe('market')

		// villages must always be loaded
		// so that we know how many villages a player has
		Meteor.subscribe('left_panel_villages')
		Meteor.subscribe('left_panel_castle')
	})
/*
	this.autorun(function() {
		var roomsImIn = Roomlist.find().fetch();
		var ids = _.pluck(roomsImIn, '_id');
		if (ids.length > 0) {
			Meteor.subscribe('recentchats', ids);
		}
	})

*/
	Session.setDefault('rightPanelInfoLoaded', false);
	this.autorun(function() {
		var selected = Session.get('selected');

		if (selected && selected.id && selected.type) {
			switch (selected.type) {
				case 'castle':
					var infoHandle = Meteor.subscribe('castleForHexInfo', selected.id);
					Session.set('rightPanelInfoLoaded', infoHandle.ready());
					break;
				case 'army':
					var infoHandle = Meteor.subscribe('armyForHexInfo', selected.id);
					Session.set('rightPanelInfoLoaded', infoHandle.ready());
					break;
				case 'village':
					var infoHandle = Meteor.subscribe('villageForHexInfo', selected.id);
					Session.set('rightPanelInfoLoaded', infoHandle.ready());
					break;
			}
		}
	})
}
