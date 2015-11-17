Template.alerts_roadSafety.created = function() {
    var self = this

    self.numShow = new ReactiveVar(10)

    self.autorun(function() {
        Meteor.subscribe('incidents_realtime_by_type',{type:'road_safety', numShow: self.numShow.get()})
    })
}

Template.alerts_roadSafety.helpers({
    alerts: function() {
        //return RealTimeIncidents.find({},{sort:{created_at:-1}})
        return IncidentsRealTimeByType.find({},{sort: {date: -1}})
    }
})


Template.alerts_roadSafety.events({
    'click #showMoreButton': function() {
        Template.instance().numShow.set(Template.instance().numShow.get() + 5)
    }
})

