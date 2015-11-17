Template.alerts_sports.created = function() {
    var self = this

    self.numShow = new ReactiveVar(10)

    self.autorun(function() {
        Meteor.subscribe('incidents_realtime_by_type',{tab:'sport', numShow: self.numShow.get()})
    })
}

Template.alerts_sports.helpers({
    alerts: function() {
        //return RealTimeIncidents.find({},{sort:{created_at:-1}})
        return IncidentsRealTimeByType.find({},{sort: {date: -1}})
    }
})


Template.alerts_sports.events({
    'click #showMoreButton': function() {
        Template.instance().numShow.set(Template.instance().numShow.get() + 5)
    }
})


