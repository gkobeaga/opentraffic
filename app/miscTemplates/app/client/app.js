Template.app.helpers({
	show_summary_panel: function() { return Session.get('show_summary_panel'); },
	show_admin_panel: function() { return Session.get('show_admin_panel'); },
	show_market_panel: function() { return Session.get('show_market_panel'); },
	show_settings_panel: function() { return Session.get('show_settings_panel'); },
	show_chatrooms_panel: function() { return Session.get('show_chatrooms_panel'); },
	showForumsPanel: function() { return Session.get('showForumsPanel'); },
	show_rankings_panel: function() { return Session.get('show_rankings_panel'); },
	show_alerts_panel: function() { return Session.get('show_alerts_panel'); },
	show_help_panel: function() { return Session.get('show_help_panel'); },
	show_stats_panel: function() { return Session.get('show_stats_panel'); },
	show_store_panel: function() { return Session.get('show_store_panel'); },
	show_tree_panel: function() { return Session.get('show_tree_panel'); },
	show_pro_panel: function() { return Session.get('show_pro_panel'); },
	showCalcPanel: function() { return Session.get('showCalcPanel'); },
	showMarkersPanel: function() { return Session.get('showMarkersPanel'); }
});



Template.app.created = function() {
	var self = this;

	// subscribe to what's onscreen
	// uses meteor package meteorhacks:subs-manager
	var subman = new SubsManager({cacheLimit:10, expireIn:9999})

}

Template.app.rendered = function() {

	document.title = "OpenTraffic";

	this.autorun(function() {
		var canvasSize = Session.get('canvas_size')
		if (canvasSize) {
			$('#left_panels').css('height', canvasSize.height - 40)
			$('#right_panels').css('height', canvasSize.height - 40)
			$('#map_body').css('height', canvasSize.height - 40)
			//$('#rp_content').css('height', canvasSize.height - 120)
			//$('#map_body').css('width', canvasSize.width)
		}
	})

	window.onresize = function() {
		var width = $(window).outerWidth(true)
		var height = $(window).outerHeight(true)
		Session.set('canvas_size', {width: width, height: height})

		Session.set('screenWidth', screen.width)

		if (screen.width < 700) {
			var pageWidth = 1000

			var zoom = screen.width / pageWidth
			if (zoom < 1) {
				var tag = document.getElementById('viewport')
				var content = 'initial-scale='+zoom+', maximum-scale='+zoom*3+', minimum-scale='+zoom+', user-scalable=yes, width='+pageWidth
				tag.setAttribute('content', content)
			}

		} else {
			var pageWidth = 1000

			var zoom = screen.width / pageWidth
			if (zoom < 1) {
				var tag = document.getElementById('viewport')
				var content = 'initial-scale='+zoom+', maximum-scale='+zoom+', minimum-scale='+zoom+', user-scalable=no, width='+pageWidth
				tag.setAttribute('content', content)
			}
		}

	}
	window.onresize()
}


Meteor.startup(function () {
	Meteor.subscribe('user_data');
	Meteor.subscribe('myReports');
})
