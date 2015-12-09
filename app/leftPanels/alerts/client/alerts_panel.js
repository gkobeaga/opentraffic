Template.alerts_panel.helpers({

    accidentsActive: function() {
        if (Template.instance().activeTab.get() == 'accidents') {
            return 'active'
            //console.log('accidents active');
        }
    },

    roadSafetyActive: function() {
        if (Template.instance().activeTab.get() == 'roadSafety') {
            return 'active'
        }
    },

    roadWorksActive: function() {
        if (Template.instance().activeTab.get() == 'roadWorks') {
            return 'active'
        }
    }
})


Template.alerts_panel.events({
    'click #accidentsButton': function(event, template) {
        event.preventDefault()
        Template.instance().activeTab.set('accidents')
        //console.log(Template.instance().activeTab.get())
    },

    'click #roadSafetyButton': function(event, template) {
        event.preventDefault()
        Template.instance().activeTab.set('roadSafety')
    },

    'click #roadWorksButton': function(event, template) {
        event.preventDefault()
        Template.instance().activeTab.set('roadWorks')
    },

    'click #sportsButton': function(event, template) {
        event.preventDefault()
        Template.instance().activeTab.set('sports')
        //console.log(Template.instance().activeTab.get())
    },

    'click #portsButton': function(event, template) {
        event.preventDefault()
        Template.instance().activeTab.set('ports')
    },

    'click .userLink': function(event, template) {

        var type = event.currentTarget.getAttribute('data-type')
        var road = event.currentTarget.getAttribute('data-road')
        var longitude = parseFloat(event.currentTarget.getAttribute('data-longitude'))
        var latitude = parseFloat(event.currentTarget.getAttribute('data-latitude'))
        var incident_id = event.currentTarget.getAttribute('data-incident_id')

        Session.set('selected', {type:type, id:incident_id,road:road,longitude:longitude,latitude:latitude});
        center_on_incident(longitude,latitude);

    },
})

Template.alerts_panel.created = function() {
    var self = this

    self.activeTab = new ReactiveVar('accidents')

}


Template.alerts_panel.rendered = function() {
    this.firstNode.parentNode._uihooks = leftPanelAnimation
}
