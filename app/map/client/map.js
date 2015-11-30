Template.map.helpers({

	roads: function() {	return Roads.find(); },

	incidents: function() {	return Incidents.find(); },
	

  provincesLayerActice: function (){ return Session.get('provinces-checkbox'); },
  roadsLayerActice: function (){ return Session.get('roads-checkbox'); },
  roadsLayerActice: function (){ return Session.get('roads-checkbox'); },
  gridLayerActice: function (){ return Session.get('grid-checkbox'); },
  incidentsLayerActice: function (){ return Session.get('incidents-checkbox'); }
})

Template.map.rendered = function() {

	var self = this

  var center = ol.proj.transform([-2.5,43.06], 'EPSG:4326', 'EPSG:3857') 

  var map_controls = [ 
    new ol.control.OverviewMap(), 
    //new ol.control.LayerSwitcher()//,
    //new ol.control.PanZoomBar(),
    //new ol.control.MousePosition()//, 
    //new ol.control.KeyboardDefaults()
  ];

  map = new ol.Map({
    layers: [],
    //controls : [],
    target: document.getElementById('map'),
    overlays: [],
    view: new ol.View({
      center: center,
      zoom: 8
    })
    })

  if (map)
    Session.set('map_created',true)

	this.autorun(function() {

  console.log('tile: '+Session.get('map_tile_source'))
      if (Session.get('map_tile_source')=='osm'){
        console.log('addtile')
        var tileLayer = new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'osm'})
        });
      } else if (Session.get('map_tile_source')=='sat'){
        console.log('addtile')
        var tileLayer = new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'})
        });
      }

      if (self.tileLayer) 
        map.removeLayer(self.tileLayer)

      self.tileLayer = tileLayer
      map.getLayers().insertAt(0,self.tileLayer)
      
  })


//	this.autorun(function() {

  // Center: Arrasate-Mondragon


  
}
