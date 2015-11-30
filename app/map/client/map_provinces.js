var subs = new ReadyManager()

Template.map_provinces.created = function() {

	this.autorun(function() {
		subs.subscriptions([{
			groupName:'adm',
			subscriptions: [
				Meteor.subscribe('map_provinces').ready()
				]
		}])
	})
}

Template.map_provinces.rendered = function() {

  var self = this

	this.autorun(function() {
	  if (subs.ready('adm') && Session.get('map_created')) {

      var styleArray = new ol.style.Style({
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

        self.provinceLayer = new ol.layer.Vector({
          source: source,
          style: styleArray 
        });
      map.getLayers().insertAt(1,self.provinceLayer)
      })
    }
  })

	this.autorun(function() {
	  if (subs.ready('adm') && Session.get('map_created')) {


    // a normal select interaction to handle click
    var select = new ol.interaction.Select();
    map.addInteraction(select);

    select.on('select', function(event) {

      var feature = event.target.getFeatures().item(0) ;
      if (feature) {
        var name = feature.get('name');
        Session.set('selected', {type:'province', name:name});
    	  Session.set('rp_template', 'rp_info_province')
      } else {
        Session.set('selected', {type:'state', name: 'Basque Country'});
    	  Session.set('rp_template', 'rp_info_state')
      }

      Session.set('rp_tab','summary');

    });

    var selectedFeatures = select.getFeatures();

  }
  })
}

Template.map_provinces.destroyed = function () {
  map.removeLayer(this.provinceLayer)
}
