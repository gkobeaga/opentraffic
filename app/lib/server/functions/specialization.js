Cue.addJob('specializationUpgrade', {retryOnError:false, maxMs:1000*60*5}, function(task, done) {
  specializationUpgrade();
  done();
});


// when someone becomes dominus gameEndDate is set
var specializationUpgrade = function() {
  var fields = {specializationChangeStarted:1};
  Meteor.users.find({specializationChanging:true}, {fields:fields}).forEach(function(user) {
    var timeToChange = s.specialization.changeTime;
    var finishAt = moment(new Date(user.specializationChangeStarted)).add(timeToChange, 'ms');
    if (moment().isAfter(finishAt)) {
      Meteor.users.update(user._id, {$set:{specializationChanging:false, specializationChangeStarted:null}});
    }
  })
}
