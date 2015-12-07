Roads = new Mongo.Collection('map_roads')
Provinces = new Mongo.Collection('map_provinces')
Grids = new Mongo.Collection('map_grids')
Density = new Mongo.Collection('map_density')


if (Meteor.isClient) {
    // client only collections 
    IncidentsRealTimeMap = new Mongo.Collection('incidents_realtime_map')
}
