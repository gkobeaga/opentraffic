Session.setDefault('canvas_size', undefined)
Session.setDefault('center_hex', undefined)	// the hex that is in the center of the screen

// set these to select something
// this is the only thing you need to do to select something
//Session.setDefault('selected', null);
Session.set('map_tile_source', 'osm');
Session.get('map_created',false)
Session.set('selected', {type:'state', name:'Basque Country'});

//Session.setDefault('rp_template', null);	// what to show in right panel
Session.setDefault('rp_template', 'rp_info_state');	// what to show in right panel
Session.setDefault('rp_tab', 'summary');	// which tab is selected in right panel


// true when the onscreen subscription is ready
// used to draw loading alert
Session.setDefault('subscription_ready', false)


// refresh templates that use time
Meteor.setInterval(function() {
	Session.set('refresh_time_field', Random.fraction())
}, 1000 * 10)

Meteor.setInterval(function() {
	Session.set('refresh_time_field_every_sec', Random.fraction())
}, 1000 * 1)

