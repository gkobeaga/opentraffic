Template.rp_changeTab.events({
    'click #rpSettingsTabButton': function(event, template) {
        set_settings_tab();
    },

    'click #rpSummaryTabButton': function(event, template) {
        set_summary_tab();
    }
});

Template.rp_changeTab.helpers({
	rpSummaryTabActive: function() { 
    if (Session.get('rp_tab') == 'summary') 
      return true
  },
	rpSettingsTabActive: function() { 
    if (Session.get('rp_tab') == 'settings') 
      return true
  }
});
