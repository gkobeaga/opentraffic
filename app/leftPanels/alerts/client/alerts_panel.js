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
    },


    sportsActive: function() {
        if (Template.instance().activeTab.get() == 'sports') {
            return 'active'
            //console.log('accidents active');
        }
    },

    portsActive: function() {
        if (Template.instance().activeTab.get() == 'ports') {
            return 'active'
        }
    },

    numUnreadAlerts: function() {
        return UnreadAlerts.find().count()
    },

    timeUntilGameEnd: function() {
        Session.get('refresh_time_field')
        return moment.duration(moment(new Date(s.game_end)) - moment()).humanize()
    },

    isGameEndDateSet: function() {
        var end = Settings.findOne({name: 'gameEndDate'})
        if (end && end.value != null) {
            return true
        } else {
            return false
        }
    },

    isGameOver: function() {
        var setting = Settings.findOne({name: 'isGameOver'})
        if (setting) {
            return setting.value
        }
    },

    timeTilGameEndWhenNewDominus: function() {
        return moment.duration(s.time_til_game_end_when_new_dominus).humanize()
    },

    gameEndDate: function() {
        var end = Settings.findOne({name: 'gameEndDate'})
        return end.value
    },

    dominus: function() {
        return RankingsDominus.findOne()
    },

    previousDominus: function() {
        return AlertPreviousDominus.findOne()
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

    this.autorun(function() {
        Meteor.subscribe('alertGameEndDate')
        Meteor.subscribe('isGameOver')
        Meteor.subscribe('lastDominusUserId')
        Meteor.subscribe('dominus_rankings')

        var lastDominusUserId = Settings.findOne({name:'lastDominusUserId'})
        if (lastDominusUserId) {
            Meteor.subscribe('alertPreviousDominus', lastDominusUserId.value)
        }
    })

}


Template.alerts_panel.rendered = function() {
    this.firstNode.parentNode._uihooks = leftPanelAnimation
}
