Template.left_panel.helpers({
	gold: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.gold;
		}
	},

	grain: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.grain;
		}
	},

	lumber: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.lumber;
		}
	},

	ore: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.ore;
		}
	},

	wool: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.wool;
		}
	},

	clay: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.clay;
		}
	},

	glass: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.glass;
		}
	},

	resources_last_interval: function() {
		var data = Template.instance().userData.get();
		if (data && data.res_update && data.res_update.from_vassal) {
			var income = {}
			_.each(s.resource.types_plus_gold, function(type) {
				income[type] = round_number(data.res_update[type] - data.res_update.from_vassal[type]) +' / '+ round_number(data.res_update.from_vassal[type])
			})
			return income
		}
	},

	show_armies_group: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.lp_show_armies;
		}
	},

	show_lords_group: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.lp_show_lords;
		}
	},

	show_allies_group: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.lp_show_allies;
		}
	},

	time_til_update: function() {
		Session.get('refresh_time_field')
		var stat = CueStats.findOne()
		if (stat) {
			var will_run_at = moment(new Date(stat.lastRunDate)).add(s.resource.interval, 'milliseconds')
			return will_run_at.fromNow()
		}
	},

	num_villages: function() {
		return Session.get('num_villages')
	},

	num_vassals: function() {
		var data = Template.instance().userData.get();
		if (data) {
			return data.num_allies_below;
		}
	}
})


Template.left_panel.events({
	'click #armies_group_link': function(event, template) {
		if (Template.instance().userData.get().lp_show_armies) {
			Meteor.call('hide_armies')
		} else {
			Meteor.call('show_armies')
		}
	},

	'click #lords_group_link': function(event, template) {
		if (Template.instance().userData.get().lp_show_lords) {
			Meteor.call('hide_lords')
		} else {
			Meteor.call('show_lords')
		}
	},

	'click #allies_group_link': function(event, template) {
		if (Template.instance().userData.get().lp_show_allies) {
			Meteor.call('hide_allies')
		} else {
			Meteor.call('show_allies')
		}
	},

	'mouseenter .summary_hover': function(event, template) {
		var self = this

		Session.set('show_summary_hover_box', true)
		Session.set('summary_hover_box_top', $(event.currentTarget).offset().top - $(event.currentTarget).outerHeight(true) - 10)

		var has_units = false
		var contents = '<table><tbody>'

		_.each(s.army.types, function(type) {
			if (self[type]) {
				contents += '<tr><td class="summary_box_type">'+_.capitalize(type)+'</td><td class="summary_box_num">'+self[type]+'</td>'
				has_units = true
			}
		})

		if (!has_units) {
			contents += '<tr><td>No&nbsp;units.</td></tr>'
		}
		contents += '</tbody></table>'
		Session.set('summary_hover_box_contents', contents)
	},

	'mouseleave .summary_hover': function(event, template) {
		Session.set('show_summary_hover_box', false)
	},

})



Template.left_panel.created = function() {
	var self = this;

	self.userData = new ReactiveVar({});
	self.autorun(function() {
		var fields = {num_allies_below:1, lp_show_lords:1, lp_show_allies:1, res_update:1, lp_show_armies:1};
		_.each(s.resource.types_plus_gold, function(type) {
				fields[type] = 1;
		});
		self.userData.set(Meteor.users.findOne(Meteor.userId(), {fields: fields}));
	})

	self.autorun(function() {
		var user = Template.instance().userData.get();
		if (user) {
			Meteor.subscribe('gather_resources_jobstat')

			if (user.lp_show_lords) {
				Meteor.subscribe('left_panel_lords')
			}

			if (user.lp_show_allies) {
				Meteor.subscribe('left_panel_allies')
			}
		}
	})
}

Template.left_panel.rendered = function() {
	this.firstNode.parentNode._uihooks = leftPanelAnimation
}
