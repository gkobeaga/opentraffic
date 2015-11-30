var subs = new ReadyManager()

Template.map_roads.created = function() {

	this.autorun(function() {
		subs.subscriptions([{
			groupName:'roads',
			subscriptions: [
				Meteor.subscribe('map_roads').ready()
				]
		}])
	})
}

Template.map_roads.rendered = function() {

  var self = this

	this.autorun(function() {
	  if (subs.ready('roads') && Session.get('map_created') && Session.get('roads-checkbox')){
/*
    var styleArray = new ol.style.Style({
      fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 0.6)'
      }),
      stroke: new ol.style.Stroke({
      color: '#0000ff',
      width: 1
      })
    }); 


    var roads = Roads.find();


    roads.forEach(function(road){
  
      var features = new ol.format.TopoJSON().readFeatures(road);
      var source = new ol.source.Vector({
      features:features
      })

      self.roadsLayer = new ol.layer.Vector({
        source: source,
        style: styleArray 
      });


      map.addLayer(self.roadsLayer)
      })
      */

var roadStyleCache = {};
  self.roadLayer = new ol.layer.Vector({
  source: new ol.source.TileVector({
    format: new ol.format.TopoJSON(),
    projection: 'EPSG:3857',
    tileGrid: new ol.tilegrid.XYZ({
      maxZoom: 19
    }),
    url: 'http://{a-c}.tile.openstreetmap.us/' +
        'vectiles-highroad/{z}/{x}/{y}.topojson'
  }),
  style: function(feature, resolution) {
    console.log(feature)
    var kind = feature.get('kind');
    var railway = feature.get('railway');
    var sort_key = feature.get('sort_key');
    var styleKey = kind + '/' + railway + '/' + sort_key;
    var styleArray = roadStyleCache[styleKey];
    if (!styleArray) {
      var color, width;
      if (railway) {
        color = '#7de';
        width = 1;
      } else {
        color = {
          'major_road': '#776',
          'minor_road': '#ccb',
          'highway': '#f39'
        }[kind];
        width = kind == 'highway' ? 1.5 : 1;
      }
      styleArray = [new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: color,
          width: width
        }),
        zIndex: sort_key
      })];
      roadStyleCache[styleKey] = styleArray;
    }
    return styleArray;
  }
});

      map.addLayer(self.roadLayer)
    }
  })
}

Template.map_roads.destroyed = function() {
      map.removeLayer(this.roadLayer)
}
