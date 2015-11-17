Meteor.methods({
    daysSinceUserActive: function(userId) {
        var fields = {status:1, lastActive:1};
        var user = Meteor.users.findOne(userId, {fields:fields});
        if (user) {
            var dateToUse = null;

            if (user.status.online) {
                if (user.status.idle) {
                    dateToUse = user.status.lastActivity;
                } else {
                    dateToUse = new Date();
                }
            } else {
                if (user.lastActive) {
                    dateToUse = user.lastActive;
                } else {
                    dateToUse = user.status.lastLogin.date;
                }
            }

            if (dateToUse) {
                var numDays = moment().diff(dateToUse, 'days');
                return numDays;
            }
        }

        return null;
    },

    // 'none', or a resource type.  'wool', 'grain'
    changeSpecialization: function(type) {
      var validTypes = ['none'];
      _.each(s.resource.types, function(res) {
        validTypes.push(res);
      })

      if (_.indexOf(validTypes, type) == -1) {
        return false;
      }

      if (type == 'none') {
        var set = {specialization:null, specializationChanging:false};
      } else {
        var set = {specialization:type, specializationChanging:true, specializationChangeStarted:new Date()};
      }

      Meteor.users.update(Meteor.userId(), {$set:set});
    }
});
