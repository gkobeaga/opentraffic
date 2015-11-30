Template.map_grid.rendered = function() {

  var self = this

	this.autorun(function() {
	  if (Session.get('map_created')) {
      self.graticule = new ol.Graticule({
    fill: new ol.style.Fill({
        color: '#BBBBBB'
    }),
        // the style to use for the lines, optional.
         strokeStyle: new ol.style.Stroke({
        color: 'rgba(24,192,24,0.5)',
        width: 3,
        lineDash: [0.5, 4]
    }),
    //projection: 'EPSG:4326',
    intervals: [2, 1,
  30 / 60, 20 / 60, 10 / 60, 5 / 60, 3 / 60, 2 / 60, 1 / 60,
  30 / 3600, 20 / 3600, 10 / 3600, 5 / 3600, 3 / 3600, 2 / 3600, 1 / 3600]
});

var graticule = new ol.Graticule({
  // the style to use for the lines, optional.
  strokeStyle: new ol.style.Stroke({
    color: 'rgba(255,120,0,0.9)',
    width: 2,
    lineDash: [0.5, 4]
  })
});
    self.graticule.setMap(map);

    }
  })
}

Template.map_grid.destroyed = function () {
  this.graticule.setMap(null)
  //map.removeLayer(this.provinceLayer)
}

