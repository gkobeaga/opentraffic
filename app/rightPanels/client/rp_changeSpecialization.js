Template.rp_changeSpecialization.helpers({
  user: function() {
    var fields = {specialization:1, specializationChanging:1, specializationChangeStarted:1}
    var user = Meteor.users.findOne(Meteor.userId(), {fields:fields});
    if (user) {
      return user;
    }
  },

  isChecked: function() {
    var fields = {specialization:1}
    var user = Meteor.users.findOne(Meteor.userId(), {fields:fields});
    if (user) {
      if (this == user.specialization) {
        return 'checked';
      }
    }
  },

  isNoneChecked: function() {
    var fields = {specialization:1}
    var user = Meteor.users.findOne(Meteor.userId(), {fields:fields});
    if (user) {
      if (!user.specialization) {
        return 'checked';
      }
    }
  },

  changeTime: function() {
    var duration = moment.duration(s.specialization.changeTime);
    return duration.humanize();
  },

  percentComplete: function() {
    Session.get('refresh_time_field')

    var fields = {specializationChangeStarted:1}
    var user = Meteor.users.findOne(Meteor.userId(), {fields:fields});
    if (user) {
      var timeToChange = s.specialization.changeTime;
      var startedAt = moment(new Date(user.specializationChangeStarted));
      var diff = moment().diff(startedAt);
      var percentage = diff / timeToChange;
      return percentage * 100;
    }
  },

  timeLeft: function() {
    Session.get('refresh_time_field')

    var fields = {specializationChangeStarted:1}
    var user = Meteor.users.findOne(Meteor.userId(), {fields:fields});
    if (user) {
      var timeToChange = s.specialization.changeTime;
      var finishAt = moment(new Date(user.specializationChangeStarted)).add(timeToChange, 'ms');
      if (moment().isAfter(finishAt)) {
        return 'soon'
      } else {
        return finishAt.fromNow()
      }
    }
  }
})



Template.rp_changeSpecialization.events({
  'click #exitButton': function(event, template) {
    Session.set('rp_template', 'rp_info_castle')
  },

  'change .specializationRadios': function(event, template) {
    var type = event.currentTarget.value;
    Meteor.call('changeSpecialization', type);
  },

  'click #cancelResearchButton': function(event, template) {
    Meteor.call('changeSpecialization', 'none');
  }
})
