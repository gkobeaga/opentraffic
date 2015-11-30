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
		var rp_tab = Session.get('rp_tab');
      console.log(rp_tab)

		if (rp_tab=='summary') {
		  if (selected && rp_tab=='summary') {
			  switch (selected.type) {
				  case 'state':
					  return { geo: RightPanelGeoInfo.findOne({state:selected.name}),
                   population: RightPanelPopInfo.find({state: selected.name}).fetch(),
                   incidents: RightPanelIncientsInfo.findOne()
                  };
					  break;
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
	  } else if (rp_tab == 'settings') {
      console.log(rp_tab)
      return {};
    }

  }

});

