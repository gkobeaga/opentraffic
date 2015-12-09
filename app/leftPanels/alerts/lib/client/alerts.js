/*
alertSharedEvents = {
    'click .openAlertButton': function(event, template) {
        if (Template.instance().isOpen.get()) {
            Template.instance().isOpen.set(false)
        } else {
            Template.instance().isOpen.set(true)
            Meteor.call('markAlertAsRead', template.data._id)
        }
    },

    'click .userLink': function(event, template) {
        var road = event.currentTarget.getAttribute('data-road')
        //var y = parseInt(event.currentTarget.getAttribute('data-'))
        //var incident_id = event.currentTarget.getAttribute('data-incident_id')

        console.log(event)
        //Session.set('selected', {type:'incident', road:road});
        //center_on_hex(x,y);
    },

    'click .armyLink': function(event, template) {
        event.preventDefault()
        event.stopPropagation()
        var x = parseInt(event.currentTarget.getAttribute('data-x'))
        var y = parseInt(event.currentTarget.getAttribute('data-y'))
        var army_id = event.currentTarget.getAttribute('data-army_id')
        Session.set('selected', {type:'army', id:army_id, x:x, y:y});
        center_on_hex(x,y);
    },

    'click .coordinateLink': function(event, template) {
        event.preventDefault()
        event.stopPropagation()
        var hex = {
            x: parseInt(event.currentTarget.getAttribute('data-x')),
            y: parseInt(event.currentTarget.getAttribute('data-y'))
        }
        check(hex.x, validNumber);
        check(hex.y, validNumber);

        Meteor.call('coords_to_id', hex.x, hex.y, 'hex', function(error, hexId) {
            if (!error && hexId) {
              Session.set('selected', {type:'hex', id:hexId, x:hex.x, y:hex.y});
              center_on_hex(hex.x, hex.y);
            }
        });
    }
}


alertSharedHelpers = {
    isOpen: function() {
        return Template.instance().isOpen.get()
    },

    read: function() {
        var userId = Meteor.userId()
        var record = _.find(this.user_ids, function(users) {
            return users.user_id == userId
        })
        return record.read
    }
}


globalAlertSharedEvents = {
    'click .openAlertButton': function(event, template) {
        if (Template.instance().isOpen.get()) {
            Template.instance().isOpen.set(false)
        } else {
            Template.instance().isOpen.set(true)
        }
    },

    'click .userLink': function(event, template) {
        var x = parseInt(event.currentTarget.getAttribute('data-x'))
        var y = parseInt(event.currentTarget.getAttribute('data-y'))
        var castle_id = event.currentTarget.getAttribute('data-castle_id')
        Session.set('selected', {type:'castle', id:castle_id, x:x, y:y});
        center_on_hex(x,y);
    },
}


globalAlertSharedHelpers = {
    isOpen: function() {
        return Template.instance().isOpen.get()
    }
}


alertSharedRendered = function() {
    this.find('.alertAnimationWrapper')._uihooks = {
        insertElement: function(node, next) {
            $(node).hide().insertBefore(next).slideDown(120)
        },
        removeElement: function(node) {
            $(node).slideUp(80, function() {
                $(this).remove()
            })
        }
    }
}
*/
