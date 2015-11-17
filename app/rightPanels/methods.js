Meteor.methods({
	reportPlayer: function(playerId, reason) {
		check(playerId, String);
		check(reason, String);

		if (reason.length < 6) {
			throw new Meteor.Error('Please give a reason why you are reporting this player.');
		}

		if (reason.length > 300) {
			throw new Meteor.Error('Reason too long.  300 characters max.');
		}

		// make sure user isn't reporting too often
		var fields = {lastReportDate:1, username:1, emails:1};
		var user = Meteor.users.findOne(Meteor.userId(), {fields:fields});

		if (!user) { return; }

		if (!user.emails[0].verified) {
			throw new Meteor.Error('Email must be verified before reporting someone.');
		}

		var rFields = {username:1};
		rUser = Meteor.users.findOne(playerId, {fields:rFields});

		if (!rUser) { return; }

		// limit reports
		if (user.lastReportDate) {
			var lastReportDate = moment(new Date(user.lastReportDate));

			if (moment() - lastReportDate < s.canReportEvery) {
				var dur = moment.duration(s.canReportEvery);
				throw new Meteor.Error('Can only make a report once '+dur.humanize()+'.');
			}
		}

		// create report
		var report = {
			user_id: playerId,
			username: rUser.username,
			reason: reason,
			createdAt: new Date(),
			reporterId: user._id,
			reporterUsername: user.username,
			active:true
		};

		Reports.insert(report);

		// global alert
		gAlert_playerReported(playerId, rUser.username, reason);

		// record date
		// users can only report once every ...
		Meteor.users.update(user._id, {$set: {lastReportDate: new Date()}});
	},


	edit_name: function(type, id, name) {
		var error = false;

		if (name.length < 1) {
			throw new Meteor.Error('Name is too short.');
		}

		if (name.length > 30) {
			throw new Meteor.Error('Name must be less than 30 characters.');
		}


		name = _.clean(name);

		switch(type) {
			case 'castle':
				var res = Castles.findOne({_id:id, user_id:Meteor.userId()}, {fields: {user_id:1}});
				if (res) {
					if (res.user_id == Meteor.userId()) {
						Castles.update(id, {$set: {name: name}});
						return true;
					}
				}
				break;
			case 'village':
				var res = Villages.findOne({_id:id, user_id:Meteor.userId()}, {fields: {user_id:1}})
				if (res) {
					if (res.user_id == Meteor.userId()) {
						Villages.update(id, {$set: {name: name}});
						return true;
					}
				}
				break;
			case 'army':
				var res = Armies.findOne({_id:id, user_id:Meteor.userId()}, {fields: {user_id:1}})
				if (res) {
					if (res.user_id == Meteor.userId()) {
						Armies.update(id, {$set: {name: name}});
						return true;
					}
				}
				break;
		}
	},


	send_gold_to: function(user_id, amount) {
		var user = Meteor.users.findOne(Meteor.userId(), {fields: {gold:1, allies_below:1, username:1, castle_id:1, x:1, y:1}})
		if (user) {
			amount = Number(amount)

			if (isNaN(amount)) {
				throw new Meteor.Error('Enter a number.')
			}

			if (amount > user.gold) {
				throw new Meteor.Error('You do not have enough gold.')
			}

			if (amount <= 0) {
				throw new Meteor.Error('Number must be greater than 0.')
			}

			if (_.indexOf(user.allies_below, user_id) != -1) {

				var tax = amount * s.sendToVassalTax;

				Meteor.users.update(user_id, {$inc: {gold: amount - tax}})
				Meteor.users.update(Meteor.userId(), {$inc: {gold: amount * -1}})

				if (!this.isSimulation) {

					Settings.upsert({name:'taxesCollected'}, {$setOnInsert:{name:'taxesCollected'}, $inc:{value:tax}})

					// send alert
					var from = user._id
					var to = user_id
					alert_receivedGoldFrom(to, from, amount)
					gAlert_sentGold(from, to, amount)

					Cue.addTask('updateNetTotal', {isAsync:true, unique:false}, {user_id: user_id})
					Cue.addTask('updateNetTotal', {isAsync:true, unique:false}, {user_id: Meteor.userId()})
				}
				return true

			}
		}

		return false
	}
})
