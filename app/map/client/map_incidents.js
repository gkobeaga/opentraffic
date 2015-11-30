var subs = new ReadyManager()

Template.map_incidents.created = function() {

	this.autorun(function() {
		subs.subscriptions([{
			groupName:'realtime',
			subscriptions: [
				Meteor.subscribe('realtime_incidents_map').ready()//,
				//Meteor.subscribe('dailystats_province_hour').ready()//,
				//Meteor.subscribe('stats_gamestats').ready()
				]
		}])
	})




}

Template.map_incidents.rendered = function() {

  var self = this
  console.log(this.parent)


//self.map = map


	this.autorun(function() {


		if (subs.ready('realtime') && Session.get('map_created') ) {
    
      var currentIncidentsMarkers = []

      var currentIncidents = IncidentsRealTimeMap.find()

		  currentIncidents.forEach(function(incident) {

        currentIncidentsMarkers.push( 
                      { _id:incident._id, 
                        feature:
                          new ol.Feature({
                            geometry: new ol.geom.Point(
                              [Number(incident.longitude),Number(incident.latitude)]
                            ).transform('EPSG:4326', 'EPSG:3857'),
                            road: incident.road,
                            sense: incident.sense,
                            type: incident.type,
                            level: incident.level
                          })
                      }
        );
      });

      var styleCache = {};

      function styleFunction(feature, resolution) {

        var type = feature.get('type');

        if (!styleCache[type]) {
          styleCache[type] = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            opacity: 0.8,
            src: 'map_images/'+type+'.png'
            }))
          });
        }
        return [styleCache[type]];
      
      }

      var currentSource = new ol.source.Vector({
        features: currentIncidentsMarkers.map(function(marker){ return marker.feature;})
      });

      if (!self.incidentsLayer) {
        self.incidentsLayer = new ol.layer.Vector({
          source: currentSource,
          style: styleFunction
        });
      } else {

        var incidentsLayer = new ol.layer.Vector({
          source: currentSource,
          style: styleFunction
        });

        map.removeLayer(self.incidentsLayer)
        self.incidentsLayer = incidentsLayer
      }

      map.addLayer(self.incidentsLayer)
    }
  })

}

Template.map_incidents.destroyed = function () {
  map.removeLayer(this.incidentsLayer)
}
