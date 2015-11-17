Meteor.publish('gather_resources_jobstat', function() {
	if (this.userId) {
		return CueStats.find({jobName:"gatherResources"}, {fields: {lastRunDate:1}});
	} else {
		this.ready();
	}
});


Meteor.publish('myReports', function() {
	if (this.userId) {

		var find = {user_id:this.userId, active:true};

		var fields = {
			user_id:1,
			username:1,
			reason:1,
			createdAt:1
		};

		return Reports.find(find, {fields:fields});
		
	} else {
		this.ready();
	}
});
