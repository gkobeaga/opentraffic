Meteor.startup(function() {

    Meteor.call('updateIncidentsRealTime1');
    Meteor.call('updateIncidentsRealTime2');
    Meteor.call('updateHourlyStats');

    Meteor.call('updateMonthlyStats');
    Meteor.call('updateDayOfWeekStats');

    Meteor.call('updateDailyStats');

    Meteor.setInterval(function(){

      Meteor.call('updateIncidentsRealTime1');
      Meteor.call('updateIncidentsRealTime2');
      Meteor.call('updateHourlyStats');
      Meteor.call('updateMonthlyStats');

      Meteor.call('updateDailyStats');
    }, s.rt_incidents_update_interval);

    Meteor.setInterval(function(){

      Meteor.call('updateIncidentsHistory');
      Meteor.call('updateDayOfWeekStats');
      Meteor.call('updateMonthlyStats');

    }, s.hist_incidents_update_interval);


	console.log('--- opentraffic started ---');


	
});
