Template.center_on_button.events({
	'click .select_button': function(event, template) {
		check(template.data, {
			selected_type: String,
			selected_id: String,
			x: validNumber,
			y: validNumber
		});

		Session.set('selected', {type:template.data.selected_type, id:template.data.selected_id, x:template.data.x, y:template.data.y});
	},

	'click .center_on_button': function(event, template) {
		check(template.data, {
			selected_type: String,
			selected_id: String,
			x: validNumber,
			y: validNumber
		});

		center_on_hex(template.data.x,template.data.y);
	}
})
