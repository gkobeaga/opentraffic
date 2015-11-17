Roads = new Mongo.Collection('map_roads')
Provinces = new Mongo.Collection('map_provinces')
Municipalities = new Mongo.Collection('map_municipalities')

if (Meteor.isClient) {
    // client only collections 
    IncidentsRealTimeMap = new Mongo.Collection('incidents_realtime_map')
}
