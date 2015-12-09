Meteor.publish('incidents_realtime_by_type', function(args) {

    var self = this

    numShow = Math.min(args.numShow, 150)

    var fields = {
        type:1,
        province:1,
        cause:1,
        name:1,
        town:1,
        date:1,
        level:1,
        road:1,
        sense:1,
        longitude:1,
        latitude:1
      }

    //if(this.userId) {
      var cur = IncidentsRealTime.find({type: args.type},{fields:fields,sort:{date:-1},limit:numShow})
      //console.log(cur.fetch())
      Mongo.Collection._publishCursor(cur, self, 'incidents_realtime_by_type')
      return self.ready();
    //} else {
        //this.ready();
    //}
})

