Template.rp_closeButton.helpers({
    selectedType: function() {
      var selected = Session.get('selected');
      if (selected) {
        return selected.type;
      }
    },

    selectedId: function() {
      var selected = Session.get('selected');
      if (selected) {
        return selected.id;
      }
    }
});


Template.rp_closeButton.events({
    'click #closeRpButton': function(event, template) {
        deselect_all();
        remove_all_highlights();
    }
});
