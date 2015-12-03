Population = new Mongo.Collection('div_population')
GeoInfo = new Mongo.Collection('div_geo_info')

RoadsInfo = new Mongo.Collection('info_roads')

IncidentsHistorical = new Mongo.Collection('incidents_historical');
IncidentsRealTime = new Mongo.Collection('incidents_realtime');

Dailystats = new Mongo.Collection('dailystats');

IncidentsDailystats = new Mongo.Collection('stats_incidents_daily');
IncidentsHourlystats = new Mongo.Collection('stats_incidents_hourly');
IncidentsWeeklystats = new Mongo.Collection('stats_incidents_weekly');
IncidentsMonthlyStats = new Mongo.Collection('stats_incidents_monthly');


Gamestats = new Mongo.Collection('gamestats');
Reports = new Mongo.Collection('reports');

if (Meteor.isClient) {
  DailystatsTypeHour = new Mongo.Collection('incidents_dailystats_type_hour');
  DailystatsProvinceHour = new Mongo.Collection('incidents_dailystats_province_hour');
}

Meteor.startup(function() {
  //Profiles = new Mongo.Collection('profiles', {connection:landingConnection});
  //Prefs = new Mongo.Collection('prefs', {connection:landingConnection});
});

