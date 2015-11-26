var subs = new ReadyManager()

Template.map_admLayers.created = function() {

	this.autorun(function() {
		subs.subscriptions([{
			groupName:'adm',
			subscriptions: [
				Meteor.subscribe('map_provinces').ready()
				]
		}])
	})
}

Template.map_admLayers.rendered = function() {

	this.autorun(function() {
	  if (subs.ready('adm') && Session.get('map_created')) {

   var styleArray = new ol.style.Style({
     /*
  fill: new ol.style.Fill({
    //color: 'rgba(255, 0, 0, 0.6)'
    color: null
  }),*/
  stroke: new ol.style.Stroke({
    color: '#d2a8ca',
    width: 2
  })
}); 

var provinces = Provinces.find();


  provinces.forEach(function(province){
  
   var features = new ol.format.TopoJSON().readFeatures(province);
   var source = new ol.source.Vector({
     features:features
   })

var vector = new ol.layer.Vector({
  source: source,
  style: styleArray 
  //
});
map.addLayer(vector)
    })
/*
map.addLayer(    new ol.layer.Tile({
      source: new ol.source.TileDebug({
        projection: 'EPSG:3857',
        tileGrid: new ol.source.OSM().getTileGrid()
      })
    })
           )
  */
  }
  })

	this.autorun(function() {
	  if (subs.ready('adm') && Session.get('map_created')) {


    // a normal select interaction to handle click
    var select = new ol.interaction.Select();
    map.addInteraction(select);

    select.on('select', function(event) {

      var feature = event.target.getFeatures().item(0) ;
      var name = feature.get('name');
      
      Session.set('selected', {type:'province', name:name});
    	Session.set('rp_template', 'rp_info_province')

    });

    var selectedFeatures = select.getFeatures();

    // a DragBox interaction used to select features by drawing boxes
    /*
    var dragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.shiftKeyOnly,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#ff0000'
        })
      })
    });

    map.addInteraction(dragBox);
    */
    /*
    function onMouseMove(browserEvent) {
      var coordinate = browserEvent.coordinate;
        var pixel = map.getPixelFromCoordinate(coordinate);

      }
      map.on('pointermove', onMouseMove);
      */
  }
  })
}
