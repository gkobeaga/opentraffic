///////////////////////////////////////////////////////////
// map functions
////////////////////////////////////////////////////////


center_on_incident = function(lon, lat) {
    //console.log([lon,lat])
    map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
    map.getView().setZoom(12)
	//}
}

incident_marker = function(lon, lat) {
    currentIncidentsMarkers.push(
      new ol.Feature({
      geometry: new ol.geom.Point(
        [Number(incident.longitude),Number(incident.latitude)]
      ).transform('EPSG:4326', 'EPSG:3857'),
      road: incident.road,
      sense: incident.sense,
      type: incident.type,
      level: incident.level
    })
    );
}

deselect_all = function() {
	Session.set('mouse_mode', 'default');
	Session.set('selected', null);
	Session.set('rp_template', null);
};

remove_all_highlights = function() {
	hex_remove_highlights()
	remove_castle_highlights()
	remove_army_highlights()
	remove_village_highlights()
};



///////////////////////////////////////////////////////////
// scale
////////////////////////////////////////////////////////





setHexScale = function(scale) {
	Session.set('hexScale', scale);
	_saveHexScale();
};

_saveHexScale = _.debounce(function() {
	Meteor.call('set_hex_scale', Session.get('hexScale'));
}, 2000);

////////////////////////////////////////////////////////////
// hex functions
////////////////////////////////////////////////////////////

// offset your position on the map
// this is pixel position not coordinates
offset_hexes = function(offset_x, offset_y) {
	var hexes_pos = Session.get('hexes_pos')
	if (hexes_pos) {
		x = hexes_pos.x + offset_x
		y = hexes_pos.y + offset_y
		move_hexes_to(x, y)
	}
}


// move the map to a position
// this is pixel position not coordinates
move_hexes_to = function(pixel_x, pixel_y) {
	check(pixel_x, validNumber)
	check(pixel_y, validNumber)
	var hexScale = Session.get('hexScale')
	if (hexScale) {
		pixel_x = parseFloat(pixel_x)
		pixel_y = parseFloat(pixel_y)
		$('#hexes').attr('transform', 'translate('+pixel_x+','+pixel_y+') scale('+Session.get('hexScale')+')')
		Session.set('hexes_pos', {x:pixel_x, y:pixel_y})
	} else {
		console.error('hexScale not set')
	}
}

// center the map on a hex
// give coordinates of a hex 3,-5
// why * -1 ?????
center_on_hex = function(lon, lat) {
	//check(lon, validNumber)
	//check(lat, validNumber)
	//var hex_scale = Session.get('hexScale')
	//var canvas_size = Session.get('canvas_size')
	/*
   if (canvas_size) {
		var grid = Hx.coordinatesToPos(x, y, s.hex_size, s.hex_squish)

		var x = canvas_size.width/2
		var y = canvas_size.height/2

		x += grid.x * hex_scale * -1
		y += grid.y * hex_scale * -1

		move_hexes_to(x, y)
    */
}


highlight_hex_path = function(from_x, from_y, to_x, to_y) {
	var hexes = Hx.getHexesAlongLine(from_x, from_y, to_x, to_y, s.hex_size, s.hex_squish);

	_.each(hexes, function(hex) {

		highlight_hex_coords(hex.x, hex.y);

		var castle = Castles.findOne({x: hex.x, y: hex.y}, {fields: {_id: 1}});
		if (castle) {
			draw_castle_highlight(hex.x, hex.y);
		}

		var village = Villages.findOne({x: hex.x, y: hex.y}, {fields: {_id: 1}});
		if (village) {
			draw_village_highlight(hex.x, hex.y);
		}

	});
};








