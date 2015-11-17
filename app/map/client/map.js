Session.setDefault('map_created',false)


Template.map.helpers({

	roads: function() {
		return Roads.find()
	},

	incidents: function() {
		return Incidents.find()
	},

	layer: function() {
		return Armies.find()
	}
})

Template.map.created = function() {
  /*
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
*/

}

//var HISTORICAL_INCIDENTS_KEY = 'historicalIncidentsShow'
//Session.setDefault(HISTORICAL_INCIDENTS_KEY, false);


//var SHOW_REGIONS_KEY = 'mapRegionsShow'
//Session.setDefault(SHOW_REGIONS_KEY, false);
//
//




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
    //layers: [tileLayer,currentLayer],//,currentLayer,roadLayer],
    //controls : [],
    target: document.getElementById('map'),
    overlays: [],
    view: new ol.View({
      center: center,
      zoom: 8
    })
    })

  Session.set('map_created',true)


//	this.autorun(function() {

  // Center: Arrasate-Mondragon


var tileLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

map.addLayer(tileLayer)

/*
map.addLayer(    new ol.layer.Tile({
      source: new ol.source.TileDebug({
        projection: 'EPSG:3857',
        tileGrid: new ol.source.OSM().getTileGrid()
      })
    })
            )
*/
 // });



 // var container = document.getElementById('popup');
 // var content = document.getElementById('popup-content');
 // var closer = document.getElementById('popup-closer');


  /**
  * Add a click handler to hide the popup.
  * @return {boolean} Don't follow the href.
  */
/*
  closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
  };
  */

  
  //console.log(currentIncidentsMarkers);

//  });


  /*

  historicalIncidentsMarkers = []

  _.each(data.historicalIncidentsInfo,function(incident){

    historicalIncidentsMarkers.push(
      new ol.Feature({
      geometry: new ol.geom.Point(
        [Number(incident.longitud),Number(incident.latitud)]
      ).transform('EPSG:3857', 'EPSG:3857'),
      carretera: incident.carretera,
      sentido: incident.sentido,
      tipo: incident.tipo,
      nivel: incident.nivel
    })
    );
  });

*/

  //console.log(d3.selectAll("#" + currentLayer.div.id));


//console.log(data.divisionDoc);

/*
var divisionSource = new ol.source.Vector({
  features: (new ol.format.GeoJSON()).readFeatures(data.regionalDivision)});

divisionLayer = new ol.layer.Vector({
  source: divisionSource//,
  //style: styleFunction
});

var roadSource = new ol.source.Vector({
  features: (new ol.format.GeoJSON()).readFeatures(data.roads)});

roadLayer = new ol.layer.Vector({
  source: roadSource,
  style: [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 2
    })
  })]
});
*/

//  });

//	this.autorun(function() {


//
//////////////////////////////////////////////////////////////////
  //
  //
  //
  //
  //
  //
  //
  //
  //

                    //}

                    //console.log(overlay)
                    //map.addLayer(overlay);



                //});

//////////////////////////////////////////////////////////////////





  }
  //});

  /*
popup = new ol.Overlay({
  element: document.getElementById('popup'),
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(popup);
*/


/*
// Events
map.on('click', function(evt) {

  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });

if (feature) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();

    console.log(feature.get('carretera'));
    console.log(feature);
  content.innerHTML = 
    '<p>Tipo:</p>' +
  '<code>' + feature.get('tipo') + '</code>'+
    '<p>Carretera:</p>' +
  '<code>' + feature.get('carretera') + '</code>'+
    '<p>Sentido:</p>' +
  '<code>' + feature.get('sentido') + '</code>'+
    '<p>Nivel:</p>' +
  '<code>' + feature.get('nivel') + '</code>'
  ;

    popup.setPosition(coord);

  } else {

    popup.setPosition(undefined);
  }  
  });
  */
//});
//}
/*

Template.map.events({

  'click .regional-division': function(){
    console.log(Session.get(SHOW_REGIONS_KEY))

    if (Session.get(SHOW_REGIONS_KEY)){
      Session.set(SHOW_REGIONS_KEY,false);
      map.removeLayer(divisionLayer);
    } else {
      Session.set(SHOW_REGIONS_KEY,true)
      map.addLayer(divisionLayer);
    }

    console.log(Session.get(SHOW_REGIONS_KEY))
    },

  'click .historical-incidents': function(){
    console.log(Session.get(HISTORICAL_INCIDENTS_KEY))
    console.log(Session.get(HISTORICAL_INCIDENTS_KEY))
}

})

//////////////////////////////////////

Template.map_settings.helpers({

  mapSettingsSchema: function() {
    return Schema.mapSettings;
  },
  regionsOptions: function () {
    return [
      {label: "Araba", value: "Araba"},
      {label: "Bizkaia", value: "Bizkaia"},
      {label: "Gipuzkoa", value: "Gipuzkoa"}
    ];
  },
  causesOptions: function () {
    return [
      {label: "Alcance", value: "Alcance"},
      {label: "Obras", value: "Obras"},
      {label: "Avería", value: "Avería"}
    ];
  },
  methodsOptions: function () {
    return [
      {label: "splancs2d", value: "splancs2d"},
      {label: "splines", value: "splines"}
    ];
  }
});

ocpu.seturl("http://localhost/ocpu/library/opentraffic/R")

Template.map_settings.events({

  'click .btn-map-settings': function(){
    console.log('Regions: ' + AutoForm.getFieldValue('regions','map-settings'));
    console.log('Causes: ' + AutoForm.getFieldValue('causes','map-settings'));
    console.log('nx: ' + AutoForm.getFieldValue('nx','map-settings'));
    console.log('ny: ' + AutoForm.getFieldValue('ny','map-settings'));
    console.log('Method: ' + AutoForm.getFieldValue('method','map-settings'));
    console.log('h0: ' + AutoForm.getFieldValue('h0','map-settings'));

    ocpu.call("map_get_density", {
            properties: {
              regions: AutoForm.getFieldValue('regions','map-settings'),
              causes: AutoForm.getFieldValue('causes','map-settings')
            },
            grd_params: {
              nx: AutoForm.getFieldValue('nx','map-settings'),
              ny: AutoForm.getFieldValue('nx','map-settings')
            },
            method : AutoForm.getFieldValue('method','map-settings'),
            dens_fun_params: {
              h0: AutoForm.getFieldValue('h0','map-settings')
            }
        }).always(function(){
    console.log(MapDensityValues.find({
            properties: {
              regions: AutoForm.getFieldValue('regions','map-settings'),
              causes: AutoForm.getFieldValue('causes','map-settings')
            },
            grd_params: {
              nx: AutoForm.getFieldValue('nx','map-settings'),
              ny: AutoForm.getFieldValue('nx','map-settings')
            },
            method : AutoForm.getFieldValue('method','map-settings'),
            dens_fun_params: {
              h0: AutoForm.getFieldValue('h0','map-settings')
            }
        }).fetch());
        
    console.log(MapDensityValues.find(getMapOptions()));

        });


  }

});

*/
