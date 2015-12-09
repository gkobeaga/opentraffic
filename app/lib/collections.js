Population = new Mongo.Collection('div_population')
GeoInfo = new Mongo.Collection('div_geo_info')

RoadsInfo = new Mongo.Collection('info_roads')

IncidentsHistory = new Mongo.Collection('incidents_history');
IncidentsRealTime = new Mongo.Collection('incidents_realtime');

IncidentsDailystats = new Mongo.Collection('stats_incidents_daily');
IncidentsHourlystats = new Mongo.Collection('stats_incidents_hourly');
IncidentsWeekDaystats = new Mongo.Collection('stats_incidents_weekday');
IncidentsMonthlyStats = new Mongo.Collection('stats_incidents_monthly');

if (Meteor.isClient) {
  DailystatsTypeHour = new Mongo.Collection('incidents_dailystats_type_hour');
  DailystatsProvinceHour = new Mongo.Collection('incidents_dailystats_province_hour');
}

