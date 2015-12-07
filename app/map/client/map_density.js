var subs = new ReadyManager()

Template.map_density.created = function() {

	this.autorun(function() {


    var provinces = []
    if (Session.get("density-province-araba")) { provinces.push('Araba') }
    if (Session.get("density-province-bizkaia") ) { provinces.push('Bizkaia') }
    if (Session.get("density-province-gipuzkoa") ) { provinces.push('Gipuzkoa') }
      
    var types = []
    if (Session.get("density-types-accidents") ) { types.push('accident') }
    if (Session.get("density-types-roadSafety") ) { types.push('road_safety') }
    if (Session.get("density-types-roadworks") ) { types.push('roadwork') }
    
    var nx = Session.get("density-param-ncells")
    var ny = Session.get("density-param-ncells")

    var method = 'splancs2d'
    var h0 = Session.get("density-param-h0")
    
     var gridQuery = {
            "properties.provinces": {"$all" : provinces},
            //"properties.types": types.length >1 ? {"$all" : types}: types[0],
            "properties.types": {"$all" : types},
            "grd_params.nx": nx,
            "grd_params.ny": ny
     }

     var densityQuery = {
            "properties.provinces": {"$all" : provinces},
            //"properties.types": types.length >1 ? {"$all" : types}: types[0],
            "properties.types": {"$all" : types},
            "grd_params.nx": nx,
            "grd_params.ny": ny,
            "method" : method,
            "dens_fun_params.h0": h0
     }


		subs.subscriptions([{
			groupName:'density',
			subscriptions: [
				Meteor.subscribe('map_grid',gridQuery).ready(),
				Meteor.subscribe('map_density',densityQuery).ready()
				]
		}])
	})
}

Template.map_density.rendered = function() {

  var self = this

	this.autorun(function() {
	  if (subs.ready('density') && Session.get('map_created')) {


      var log = d3.scale.log()

      var range = [log(1e-9),log(1e-5)];
      var ncuts = 5;

      var styleCache = {};
      var scale = chroma.scale(['lightyellow', 'navy']).domain(range).classes(ncuts);
      var cuts = scale.classes()
      
      
      function cutFuction(value) {

        if (log(value) < cuts[0] ) 
          return 0
        else if (log(value) < cuts[1] ) 
          return 1
        else if (log(value) < cuts[2] ) 
          return 2
        else if ( log(value) < cuts[3] ) 
          return 3
        else if ( log(value) < cuts[4] ) 
          return 4
        else if ( log(value) < cuts[5] ) 
          return 5
        else 
          return ncuts+1
      }

      function fillFuction(cut) {
        if (cut ==ncuts +1 ) {
          return null
        } else {
          return  new ol.style.Fill({
              color: scale(cuts[cut]).hex()
            })
        }
      }

      function styleFunction(feature, resolution) {

        var value = feature.get('value')
        var cut = cutFuction(value)

        if (!styleCache[cut]) {

        styleCache[cut] = new ol.style.Style({
            fill : fillFuction(cut)  });
        }
        return [styleCache[cut]];
      
      }

      var grid = Grids.findOne();
      var density = Density.findOne();

      var ncells = 10000
      _.range(0,ncells).forEach( function(poly){
        grid.objects.grid.geometries[poly].properties.value = density.values[poly]

      })



  
      var features = new ol.format.TopoJSON().readFeatures(grid);
      var source = new ol.source.Vector({
          features:features
      })

      self.densityLayer = new ol.layer.Vector({
          source: source,
          style: styleFunction
      });

      console.log(grid)
      console.log(density)
      
      var nLayers = map.getLayers().getArray().length
      map.getLayers().insertAt(nLayers -1,self.densityLayer)
    }
  })

}

Template.map_density.destroyed = function () {
  map.removeLayer(this.densityLayer)
}

