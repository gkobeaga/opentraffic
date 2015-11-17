Template.rp_info_hex.helpers({
	isPro: function() {
		var profile = Profiles.findOne();
		if (profile && profile.pro) {
			return true;
		}
	},

	battleInfoLoaded: function() {
		return Template.instance().battleInfoLoaded.get()
	},

	battle: function() {
		if (this) {
			return Battles2.findOne({x:this.x, y:this.y})
		}
	},

	typeName: function() {
		if (this && this.large) {
			return _.titleize('large '+this.type)
		} else {
			return _.titleize(this.type)
		}
	},

	isGrain: function() {
		return this.type == 'grain'
	},

	numResources: function() {
		if (this && this.large) {
			return s.resource.gained_at_hex * s.resource.large_resource_multiplier
		} else {
			return s.resource.gained_at_hex
		}
	},

	interval: function() {
		return moment.duration(s.resource.interval).humanize()
	},

	worthOfHex: function() {
		return Template.instance().worthOfHex.get()
	}

})



Template.rp_info_hex.created = function() {
	var self = this;

	self.worthOfHex = new ReactiveVar(0);
	self.autorun(function() {
		var profile = Profiles.findOne();
		if (profile && profile.pro) {
			var selected = Session.get('selected');
			if (selected && Number.isInteger(selected.x) && Number.isInteger(selected.y)) {
				Meteor.call('getWorthOfHex', selected.x, selected.y, function(error, worth) {
					self.worthOfHex.set(worth + s.resource.gold_gained_at_village);
				});
			}
		}
	});

	self.autorun(function() {
		var selected = Session.get('selected');
		if (selected && Number.isInteger(selected.x) && Number.isInteger(selected.y)) {
			Meteor.subscribe('gamePiecesAtHex', selected.x, selected.y);
		}
	});

	// If a hex is selected and there is a Castle or Village, select it instead.
	self.autorun(function() {
		var selected = Session.get('selected');
		if (selected && Number.isInteger(selected.x) && Number.isInteger(selected.y) && selected.type == 'hex') {
			var castle = Castles.findOne({x: selected.x, y: selected.y}, {fields:{_id:1}});
			var village = Villages.findOne({x: selected.x, y: selected.y}, {fields:{_id:1}});
			if (castle) {
				Session.set('selected', {type:'castle', id:castle._id, x:selected.x, y:selected.y});
			}
			if (village) {
				Session.set('selected', {type:'village', id:village._id, x:selected.x, y:selected.y});
			}
		}
	});

	Session.set('mouse_mode', 'default')
	Session.set('update_highlight', Random.fraction())

	self.battleInfoLoaded = new ReactiveVar(false)
	this.autorun(function() {
		var selected = Session.get('selected');
		if (selected && Number.isInteger(selected.x) && Number.isInteger(selected.y)) {
			var battleInfoHandle = Meteor.subscribe('battle_notifications_at_hex', selected.x, selected.y)
			self.battleInfoLoaded.set(battleInfoHandle.ready())
		}
	})
}
