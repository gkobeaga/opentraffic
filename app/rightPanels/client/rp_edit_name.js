Template.rp_edit_name.events({
	'click #edit_name_button': function(event, template) {
		var name = template.find('#edit_name_input')
		var alert = template.find('#edit_name_error_alert')
		var button = template.find('#edit_name_button')

		$(alert).hide()

		var button_html = $('#edit_name_button').html()
		$(button).attr('disabled', true)
		$(button).html('Please Wait')

		var selected = Session.get('selected');

		if (!selected) {
			return;
		}

		Meteor.call('edit_name', selected.type, selected.id, $(name).val(), function(error, result) {
			$(button).attr('disabled', false)
			$(button).html(button_html)

			if (error) {
				$(alert).show()
				$(alert).html(error.error)
			} else {
				switch(selected.type) {
					case 'castle':
						Session.set('rp_template', 'rp_info_castle')
						break;
					case 'village':
						Session.set('rp_template', 'rp_info_village')
						break;
					case 'army':
						Session.set('rp_template', 'rp_info_army')
						break;
				}
			}
		})

	},


	'click #edit_name_cancel_button': function(event, template) {
		var selected = Session.get('selected');

		if (!selected) {
			return;
		}

		switch(selected.type) {
			case 'castle':
				Session.set('rp_template', 'rp_info_castle')
				break;
			case 'village':
				Session.set('rp_template', 'rp_info_village')
				break;
			case 'army':
				Session.set('rp_template', 'rp_info_army')
				break;
		}
	}
})
