Template.settings_panel.helpers({
	username: function() {
		var user = Meteor.users.findOne(Meteor.userId(), {fields: {username:1}})
		if (user) {
			return user.username
		}
	},

	ocpu_url: function() {
		var ocpu = Meteor.users.findOne(Meteor.userId(), {fields: {opcu_url:1}})
		if (user) {
			return ocpu.opcu_url
		}
	}
})

Template.settings_panel.events({
	'click #toggle_coords_button': function(event, template) {
		if (get_user_property("sp_show_coords")) {
			Meteor.call('hide_coords')
		} else {
			Meteor.call('show_coords')
		}
	},

	'click #toggle_minimap_button': function(event, template) {
		if (get_user_property("sp_show_minimap")) {
			Meteor.call('hide_minimap')
		} else {
			Meteor.call('show_minimap')
		}
	},

	'click #change_username_button': function(event, template) {
		var input = template.find('#change_username_input')
		var button = template.find('#change_username_button')
		var alert = template.find('#change_username_alert')

		var error = false
		var msg = ''
		$(alert).hide()
		var username = $(input).val()

		if (error) {
			$(alert).show()
			$(alert).html(msg)
		} else {
			var button_html = $(button).html()
			$(button).attr('disabled', true)
			$(button).html('Please Wait')

			Meteor.apply('change_username', [username], {wait:false, onResultReceived:function(error, result){
				if (error) {
					$(alert).show()
					$(alert).html(error.error)
				} else {
					$(input).val(username)
				}
				$(button).attr('disabled', false)
				$(button).html(button_html)
			}})
		}
	},

	'click #delete_account_button': function(event, template) {
		var button = template.find('#change_username_button')
	},

	'click #deleteAccountButton': function(event, template) {
		var confirmCont = template.find('#deleteAccountConfirmationContainer')
		var butCont = template.find('#deleteAccountButtonContainer')

		$(butCont).hide()
		$(confirmCont).slideDown(100)
	},

	'click #deleteAccountCancelButton': function(event, template) {
		var confirmCont = template.find('#deleteAccountConfirmationContainer')
		var butCont = template.find('#deleteAccountButtonContainer')

		$(butCont).slideDown(100)
		$(confirmCont).hide()
	},

	'click #deleteAccountConfirmButton': function(event, template) {
		Meteor.call('deleteAccount')
	}
})

Template.settings_panel.rendered = function() {
	this.firstNode.parentNode._uihooks = leftPanelAnimation
}
