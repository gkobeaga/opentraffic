
Template.alerts_ports.helpers({
    alerts: function() {
        //return RealTimeIncidents.find({},{sort:{created_at:-1}})
        //return IncidentsRealTime.find({type:'port'},{limit:self.numShow.get()})
        return IncidentsRealTimeByType.find({},{sort: {date: -1}})
        //return IncidentsRealTime.find({type:'port'},{sort: {date: -1},limit:self.numShow.get()})
    }
})


Template.alerts_ports.events({
    'click #showMoreButton': function() {
        Template.instance().numShow.set(Template.instance().numShow.get() + 5)
    }
})


Template.alerts_ports.created = function() {
    var self = this

    self.numShow = new ReactiveVar(10)

    self.autorun(function() {
        Meteor.subscribe('incidents_realtime_by_type',{type:'port', numShow: self.numShow.get()})
    })
}
