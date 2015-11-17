Cue.addJob('check_for_dominus', {retryOnError:false, maxMs:1000*60*2}, function(task, done) {
	checkForDominus();
	done()
})



checkForDominus = function() {
	var num_users = Meteor.users.find({castle_id: {$exists: true}}).count()

	if (num_users <= 1) {
		return;
	}

	var dominus = Meteor.users.findOne({is_dominus: true}, {fields: {_id:1}})
	var is_still_dominus = false

	// set everyone to not dominus
	Meteor.users.find({is_dominus: true}).forEach(function(u) {
		Meteor.users.update(u._id, {$set: {is_dominus: false}})
	})

	// find dominus
	var fields = {emails:1};
	Meteor.users.find({is_king:true}, {fields:fields}).forEach(function(king) {

		// get number of players who are not under king
		var find = {_id:{$ne:king._id}, king:{$ne:king._id}, castle_id: {$exists: true}}
		var nonVassals = Meteor.users.find(find).count();

		// in none then dominus
		if (nonVassals == 0) {

			Meteor.users.update(king._id, {$set: {is_dominus: true}});

			if (dominus) {
				if (king._id == dominus._id) {
					is_still_dominus = true;
				} else {
					new_dominus_event(king);
				}
			} else {
				new_dominus_event(king);
			}

		}
	})

	// if old dominus is no longer dominus
	// there is a new dominus
	if (dominus) {
		if (!is_still_dominus) {
			alert_noLongerDominus(dominus._id)
		}
	}
}


Cue.addJob('removeDominus', {retryOnError:false, maxMs:1000*60*2}, function(task, done) {
	remove_dominus()
	done()
})

// called when new user joins the game
remove_dominus = function() {
	var dominus = Meteor.users.findOne({is_dominus:true}, {fields:{_id:1}})
	if (dominus) {
		gAlert_noLongerDominusNewUser(dominus._id)
		alert_noLongerDominusNewUser(dominus._id)
		Meteor.users.update(dominus._id, {$set: {is_dominus: false}})
	}
}


// happens when there is a new dominus
new_dominus_event = function(dominus_user) {
	check(dominus_user, Object);
	check(dominus_user._id, String);
	check(dominus_user.emails[0].address, String);

	// make sure dominus and last dominus are not the same
	var lastDominus = Settings.findOne({name: 'lastDominusUserId'})

	if (lastDominus) {
		var lastDominusUserId = lastDominus.value
	} else {
		var lastDominusUserId = null
	}

	if (dominus_user._id != lastDominusUserId) {

		// set game end date
		var endDate = moment(new Date()).add(s.time_til_game_end_when_new_dominus, 'ms').toDate()
		Settings.upsert({name: 'gameEndDate'}, {$set: {name: 'gameEndDate', value: endDate}})
		Settings.upsert({name: 'lastDominusUserId'}, {$set: {name: 'lastDominusUserId', value: dominus_user._id}})
	}

	// send notifications
	gAlert_newDominus(dominus_user._id, lastDominusUserId);
	alert_youAreDominus(dominus_user._id);

	// update profile
	var options = {};
	callLandingMethod('profile_becameDominus', dominus_user.emails[0].address, options);
	
	// let landing site know to close registration
	landingConnection.call('dominusTriggered', process.env.GAME_ID, process.env.DOMINUS_KEY);
}
