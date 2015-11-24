Template.right_panel.helpers({
	rp_template: function() {
		var template = Session.get('rp_template')
		if (template) {
			return template
		} else {
			return 'empty_template'
		}
	},

	rp_template_data: function() {
		var selected = Session.get('selected');
		if (selected) {
			switch (selected.type) {
				case 'province':
					return { geo: RightPanelGeoInfo.findOne({province:selected.name}),
                   population: RightPanelPopInfo.find({province: selected.name}).fetch(),
                   incidents: RightPanelIncientsInfo.findOne()
                 };
					break;
				case 'road':
					return RightPanelRoads.findOne(selected.id);
					break;
				}
		}

		return {};
	},

	show_summary_panel: function() { return Session.get('show_summary_panel'); },
	show_mapSettings_panel: function() { return Session.get('show_mapSettings_panel'); }
});

