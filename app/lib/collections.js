IncidentsHistorical = new Mongo.Collection('incidents_historical');
IncidentsRealTime = new Mongo.Collection('incidents_realtime');

IncidentsDailystats = new Mongo.Collection('incidents_dailystats');
IncidentsWeeklystats = new Mongo.Collection('incidents_weeklystats');

Dailystats = new Mongo.Collection('dailystats');
Gamestats = new Mongo.Collection('gamestats');
Reports = new Mongo.Collection('reports');

if (Meteor.isClient) {
  DailystatsTypeHour = new Mongo.Collection('incidents_dailystats_type_hour');
  DailystatsProvinceHour = new Mongo.Collection('incidents_dailystats_province_hour');
}

if (Meteor.isServer) {
	Dailystats.allow({insert: false, update: false, remove: false});
	Meteor.users.allow({insert: false, update: false, remove: false});
	Gamestats.allow({insert: false, update: false, remove: false});
	Reports.allow({insert: false, update: false, remove: false});
}

Meteor.startup(function() {
  //Profiles = new Mongo.Collection('profiles', {connection:landingConnection});
  //Prefs = new Mongo.Collection('prefs', {connection:landingConnection});
});

