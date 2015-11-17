Template.rp_disband_army_confirm.events({
	'click #disband_army_button_yes': function(event, template) {
		var selected = Session.get('selected');
		if (selected) {
			$('#disband_army_button_yes').attr('disabled', true)
			$('#disband_army_button_yes').html('Please Wait')
			Meteor.call('disband_army', selected.id);
			remove_all_highlights()
			deselect_all()
		}
	},

	'click #disband_army_button_no': function(event, template) {
		Session.set('rp_template', 'rp_info_army')
	},
})


Template.rp_disband_army_confirm.created = function() {
	Session.set('mouse_mode', 'modal')
}
