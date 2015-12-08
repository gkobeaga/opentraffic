Session.set("density-province-araba", true);
Session.set("density-province-bizkaia", true);
Session.set("density-province-gipuzkoa", true);

Session.set("density-types-accidents", true);
Session.set("density-types-roadSafety", false);
Session.set("density-types-roadworks", false);

Session.set("density-param-ncells", 100);
Session.set("density-param-method", "splancs");
Session.set("density-param-h0", 1000);

Session.set("ocpuActive", false);

Template.rp_settings_density.helpers({

	ocpuActive: function() {
		return Session.get('ocpuActive');
	},

	provinceGraphsLoaded: function() {
		return Session.get('rightPanelGraphsLoaded');
	},

  ncells: function() {
    var ncells = Session.get('density-param-ncells')
      return ncells + 'x' + ncells
  },

  method: function() {
    return Session.get('density-param-method')
  },

  h0: function() {
    return Session.get('density-param-h0')
  },

  toggle_options : function(){
                return {
                    "size": "mini"
                }
            }

})

ocpu.seturl("http://opentraffic.bcamath.org/ocpu/library/opentraffic/R")
//ocpu.seturl("http://localhost/ocpu/library/opentraffic/R")

Template.rp_settings_density.events({
    'click #ncells-100' : function(event, template) {
      Session.set('density-param-ncells',100)
    },

    'click #ncells-200' : function(event, template) {
      Session.set('density-param-ncells',200)
    },

    'click #ncells-400' : function(event, template) {
      Session.set('density-param-ncells',400)
    },

    'click #h0-500' : function(event, template) {
      Session.set('density-param-h0',500)
    },

    'click #h0-1000' : function(event, template) {
      Session.set('density-param-h0',1000)
    },

    'click #h0-1500' : function(event, template) {
      Session.set('density-param-h0',1500)
    },

  'click #ocpuCallButton': function(){
    var provinces = []
    var nprovinces = []
    Session.get("density-province-araba") ?  provinces.push('Araba') : nprovinces.push('Araba')
    Session.get("density-province-bizkaia") ?  provinces.push('Bizkaia') : nprovinces.push('Bizkaia')
    Session.get("density-province-gipuzkoa") ?  provinces.push('Gipuzkoa') : nprovinces.push('Gipuzkoa')
      
    var types = []
    var ntypes = []
    Session.get("density-types-accidents") ? types.push('accident') : ntypes.push('accident') 
    Session.get("density-types-roadSafety") ? types.push('road_safety') : ntypes.push('road_safety') 
    Session.get("density-types-roadworks") ? types.push('roadwork') : ntypes.push('roadwork') 
    
    var nx = Session.get("density-param-ncells")
    var ny = Session.get("density-param-ncells")

    var method = 'splancs2d'
    var h0 = Session.get("density-param-h0")
    
    console.log("Ocpu started")
    Session.set('density-checkbox',false);
    Session.set('ocpuActive',true);
    ocpu.call("map_get_density", {
            properties: {
              provinces: provinces,
              types: types
            },
            grd_params: {
              nx: nx,
              ny: ny
            },
            method : method,
            dens_fun_params: {
              h0: h0
            }
        }, function(session){
          console.log("Ocpu response")
          Session.set('ocpuActive',false);
          Session.set('density-checkbox',true);
          Session.set('map-density-layer-loaded',true);
        //    session.getObject(function(data){
        //        console.log(data);
        //       });
        }).always(function(){
          console.log("Ocpu finished")

    /*
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
        */
        

        });

    }

});

