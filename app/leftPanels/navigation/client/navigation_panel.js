Template.navigation_panel.helpers({
	show_minimap: function() { return get_user_property("sp_show_minimap") }
})


Template.navigation_panel.events({
	// grid movement
	'mousedown #move_grid_left_button': function(event, template) { template.moveLeft.set(true) },
	'mouseup #move_grid_left_button': function(event, template) { template.moveLeft.set(false) },
	'mouseleave #move_grid_left_button': function(event, template) { template.moveLeft.set(false) },

	'mousedown #move_grid_up_button': function(event, template) { template.moveUp.set(true) },
	'mouseup #move_grid_up_button': function(event, template) { template.moveUp.set(false) },
	'mouseleave #move_grid_up_button': function(event, template) { template.moveUp.set(false) },

	'mousedown #move_grid_right_button': function(event, template) { template.moveRight.set(true) },
	'mouseup #move_grid_right_button': function(event, template) { template.moveRight.set(false) },
	'mouseleave #move_grid_right_button': function(event, template) { template.moveRight.set(false) },

	'mousedown #move_grid_down_button': function(event, template) { template.moveDown.set(true) },
	'mouseup #move_grid_down_button': function(event, template) { template.moveDown.set(false) },
	'mouseleave #move_grid_down_button': function(event, template) { template.moveDown.set(false) },

	'click #move_grid_goto_button': function(event, template) {
		var x = Number($(template.find('#move_grid_x')).val())
		var y = Number($(template.find('#move_grid_y')).val())

		check(x, validNumber);
		check(y, validNumber);
		if (!isNaN(x) && !isNaN(y)) {
			Meteor.call('coords_to_id', x, y, 'hex', function(error, hexId) {
				if (!error && hexId) {
					Session.set('selected', {type:'hex', id:hexId, x:x, y:y});
					center_on_hex(x, y);
				}
			});
		}
	},

	'click #increase_scale_button': function(event, template) {
		increase_map_zoom()
	},

	'click #decrease_scale_button':function(event, template) {
		decrease_map_zoom()
	},
})


Template.navigation_panel.created = function() {
	var self = this
	self.moveUp = new ReactiveVar(false)
	self.moveDown = new ReactiveVar(false)
	self.moveLeft = new ReactiveVar(false)
	self.moveRight = new ReactiveVar(false)
	self.gridMoveTimer = undefined
}

Template.navigation_panel.rendered = function() {
	var self = this

	// arrow keys to scroll map
	$(document).keydown(function(event) {
		if (event.keyCode == 38 ) {
			self.moveUp.set(true)
		}

		if (event.keyCode == 39 ) {
			self.moveRight.set(true)
		}

		if (event.keyCode == 40 ) {
			self.moveDown.set(true)
		}

		if (event.keyCode == 37 ) {
			self.moveLeft.set(true)
		}
	})

	$(document).keyup(function(event) {
		if (event.keyCode == 38) {
			self.moveUp.set(false)
		}

		if (event.keyCode == 39) {
			self.moveRight.set(false)
		}

		if (event.keyCode == 40) {
			self.moveDown.set(false)
		}

		if (event.keyCode == 37) {
			self.moveLeft.set(false)
		}
	})

	// arrow keys to scroll map
	self.autorun(function() {
		if (typeof(self.gridMoveTimer) != "undefined") {
			Meteor.clearInterval(self.gridMoveTimer)
		}

		if (self.moveUp.get() || self.moveRight.get() || self.moveDown.get() || self.moveLeft.get()) {
			self.gridMoveTimer = Meteor.setInterval(function() {
				Deps.nonreactive(function() {
          var extent = map.getView().calculateExtent(map.getSize());
          var vMove = (extent[2]-extent[0]) / 4;
          var hMove = (extent[3]-extent[1]) / 4 ;

          var center = map.getView().getCenter();


					if (self.moveUp.get()) {

              center[1] += vMove
					}

					if (self.moveRight.get()) {
              center[0] += hMove
					}

					if (self.moveDown.get()) {
              center[1] -= vMove
					}

					if (self.moveLeft.get()) {
              center[0] -= hMove
					}
          
          map.getView().setCenter(center)
				})
			}, 33)
		}
	})
}


Template.navigation_panel.destroyed = function() {
	$(document).unbind('keydown')
	$(document).unbind('keyup')
}


decrease_map_zoom = function() {
	var map_zoom = map.getView().getZoom()
	map_zoom -= 1
	//if (map_zoom < s.map_zoom_min) {
	if (map_zoom < 1) {
		map_zoom = 1
		//map_zoom = s.map_zoom_min
	}
  map.getView().setZoom(map_zoom)
}

increase_map_zoom= function() {
	var map_zoom = map.getView().getZoom()
	map_zoom += 1
	//if (map_zoom > s.map_zoom_max) {
	if (map_zoom > 14) {
		map_zoom = 14
	}
  map.getView().setZoom(map_zoom)
}
