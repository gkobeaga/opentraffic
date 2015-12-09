IncidentsWeek = new Mongo.Collection('incidents_week');

if (Meteor.isClient) {
    // client only collections to hold data for alerts
    IncidentsRealTimeByType = new Mongo.Collection('incidents_realtime_by_type')

}
