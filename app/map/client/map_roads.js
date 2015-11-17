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

	this.autorun(function() {
	  if (subs.ready('roads') && Session.get('map_created')) {

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

var vector = new ol.layer.Vector({
  source: source,
  style: styleArray 
});
    console.log('map_roads: Ez')
map.addLayer(vector)
    console.log('map_roads: BAI')
    })
  }
  })
}
