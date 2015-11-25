Meteor.methods({
  
  getIncidentsRealTime1: function() {
    this.unblock();
    var url = 'http://www.trafikoa.net/servicios/IncidenciasTDT/IncidenciasTrafikoTDTGeo';
    
    var response = HTTP.call('GET', url, {
      encoding: null, 
      responseType: 'buffer' 
    });

    var result = iconv.decode(response.content,'iso-8859-1');
    return result;

  },
  getIncidentsRealTime2: function() {
    this.unblock();
    var url = 'http://www.navarra.es/appsext/inccarreteras/JsIncidencias.aspx';
    
    var response = HTTP.call('GET', url, {
      encoding: null, 
      responseType: 'buffer' 
    });

    var result = iconv.decode(response.content,'iso-8859-1');
    return result;

  },


  updateIncidentsRealTime1: function() {

    Meteor.call('getIncidentsRealTime1', function(err, res) {
      var data = xml2js.parseStringSync(res).raiz.incidenciaGeolocalizada;
      //console.log(data);
      _.each(data,function(incident) {

        var incidentDoc = {};
        
        // type
        if (incident.tipo[0] == 'Accidente')
          incidentDoc.type = 'accident';
        else if (incident.tipo[0] == 'Obras')
          incidentDoc.type = 'roadwork';
        else if (incident.tipo[0] == 'Seguridad vial')
          incidentDoc.type = 'road_safety';
        else if (incident.tipo[0] == 'Pruebas deportivas')
          incidentDoc.type = 'sport';
        else if (incident.tipo[0] == 'Puertos de montaña')
          incidentDoc.type = 'port';
        else if (incident.tipo[0] == 'Vialidad invernal tramos')
          incidentDoc.type = 'winter_road';
        else if (incident.tipo[0] == 'Meteorológica')
          incidentDoc.type = 'weather';
        else if (incident.tipo[0] == 'Otras incidencias')
          incidentDoc.type = 'other_incidents';
        else {
          console.log('Unknown incident type: ' + incident.tipo[0]);
          incidentDoc.type = 'other_incidents';
        }


        // 
        if (!Number.isNaN(incident.autonomia) && incident.autonomia !='')
          incidentDoc.autonomy = _.titleize(incident.autonomia[0]);

        if (!Number.isNaN(incident.provincia) && incident.provincia !='') {
          if (incident.provincia[0] == 'Alava-Araba')
            incidentDoc.province = 'Araba';
          else
          incidentDoc.province = _.titleize(incident.provincia[0]);
        }
        if (!Number.isNaN(incident.matricula) && incident.matricula !='')
          incidentDoc.matricula = incident.matricula[0];

        if (!Number.isNaN(incident.causa) && incident.causa !='')
          incidentDoc.cause = _.titleize(incident.causa[0]);

        if (!Number.isNaN(incident.poblacion) && incident.poblacion !='')
          incidentDoc.town = incident.poblacion[0];

        if (!Number.isNaN(incident.fechahora_ini) && incident.fechahora_ini !='' && incident.tipo !='Pruebas deportivas')
          var date = new Date(incident.fechahora_ini[0]);
        else if ( incident.tipo =='Pruebas deportivas' )
          var date = new Date( incident.fechahora_ini[0].substr(0,10) );
        else 
          var date = NaN;
      

        if (!Number.isNaN(incident.nivel) && incident.nivel !='')
          var level = incident.nivel[0];

        if (!Number.isNaN(incident.carretera) && incident.carretera !='')
          incidentDoc.road = incident.carretera[0];

        if (!Number.isNaN(incident.sentido) && incident.sentido !=''){
          var nameWords = _.words(incident.sentido[0],'/');
          if ( nameWords.length>1)
            var name = _.join('/',_.titleize(nameWords[0]),_.titleize(nameWords[1]));
          else
            var name = _.titleize(nameWords);
          incidentDoc.sense = name;
        }

        if (incident.tipo == 'Pruebas deportivas') {

          var romanRegExp = new RegExp('^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$');
          var romanNumber = null;
          var splitName = _.words(incident.nombre[0]);
          var sportName = '';

          _.each(splitName,function(word){

            sWord = word.replace('.', '');

            if (romanRegExp.exec(sWord)!=null)
              sportName = _.join(' ', _.clean(sportName),word);
            else 
              sportName = _.join(' ', _.clean(sportName), _.titleize(word) );

          });
          
          incidentDoc.name = sportName;

        }

        if (!Number.isNaN(incident.pk_inicial) && incident.pk_inicial !='')
          incidentDoc.initial_kilometer = incident.pk_inicial[0];
        else 
          incidentDoc.initial_kilometer = NaN;

        if (!Number.isNaN(incident.pk_final) && incident.pk_final !='')
          incidentDoc.final_kilometer = incident.pk_final[0];
        else 
          incidentDoc.final_kilometer = NaN;

        if (!Number.isNaN(incident.longitud) && incident.longitud !='0.0' && incident.longitud !='0.00')
          incidentDoc.longitude = incident.longitud[0];
        else 
          incidentDoc.longitude = NaN;

        if (!Number.isNaN(incident.latitud) && incident.latitud !='0.0' && incident.latitud !='0.00')
          incidentDoc.latitude = incident.latitud[0];
        else 
          incidentDoc.latitude = NaN;

        IncidentsRealTime.update(
          incidentDoc, 
          { $set: {updated_at : new Date(),level:level},
            $setOnInsert: { created_at: new Date(), date: date}
          },
          { upsert:true }
        );

        IncidentsWeek.update(
          incidentDoc, 
          { $set: {updated_at : new Date(),level:level},
            $setOnInsert: { created_at: new Date(), date: date}
          },
          { upsert:true }
        );

      });

      var now = new Date();
      var noUpdatedRemoveQuery= {updated_at: {$lte: new Date(now - s.rt_incidents_update_interval)}}
      //var noTodayRemoveQuery= {updated_at: {$lt: new Date(now - s.rt_incidents_update_interval+1000)}}

      IncidentsRealTime.remove( noUpdatedRemoveQuery );

      var weekRemoveQuery= { 
        $or : [ 
          { date: {$gt : now}}, 
          { date: {$lt: new Date( now - 1000*60*60*24*7)}}
        ]
      }
            //var query= {createdAt: {$lt: new Date("2015-12-31"), $gt: new Date("2015-01-01")}}

      //IncidentsWeek.remove( weekRemoveQuery );

      console.log('Real Time Incidents 1 updated ('+ data.length +' incidents).');

    })
  },


  updateIncidentsRealTime2: function() {

    Meteor.call('getIncidentsRealTime2', function(err, res) {
      //var data = xml2js.parseStringSync(res).raiz.incidenciaGeolocalizada;
      //console.log(data);
      //
      var data = res.substring(1,res.length-2)
                    .replace(/\\,/g, '.')
                    .replace(/\\t/g, ' ')

      data = JSON.parse(data);

      //console.log(data);
      _.each(data.incidencia,function(incident) {

        var incidentDoc = {};

        /**********
         * _id
         ***********/ 
        incidentDoc.incident_id = incident.id_incidencia;
  
        /**********
         *type
         ***********/ 
         
        if (incident.categoria == 'Obras')
          incidentDoc.type = 'roadwork';
        else if (incident.categoria == 'Red Viaria')
          incidentDoc.type = 'road_safety';
        else if (incident.categoria == 'Meteorológicas')
          incidentDoc.type = 'weather';
        else {
          console.log('Unknown incident type: ' + incident.tipo[0]);
          incidentDoc.type = 'other_incidents';
        }

        /**********
         *province
         ***********/ 

        incidentDoc.province = 'Nafarroa Garaia';

        /**********
         * Description
         ***********/ 

        if (!Number.isNaN(incident.descripcion) && incident.descripcion !='')
          incidentDoc.description = incident.descripcion;

        /**********
         * Poblation
         ***********/ 

        if (!Number.isNaN(incident.poblacion) && incident.poblacion !='')
          incidentDoc.town = incident.distrito;

        /**********
         * Date
         ***********/ 

        if (!Number.isNaN(incident.fecha) && incident.fecha !='' )
          var date = new Date(moment(incident.fecha, "DD-MM-YYYY hh:mm:ss").format())
        else 
          var date = NaN;

        /**********
         * Level
         ***********/ 
      
        if (!Number.isNaN(incident.nivel) && incident.nivel !='')
          var level = incident.nivel_afeccion;

        /**********
         * Road
         ***********/ 

        if (!Number.isNaN(incident.cod_carretera_actual) && incident.cod_carreterea_actual !='')
          incidentDoc.road = incident.cod_carretera_actual;

        /**********
         * kilometric point
         ***********/ 

        if (!Number.isNaN(incident.pk) && incident.pk !='')
          incidentDoc.kp = incident.pk;
        else 
          incidentDoc.kp = NaN;

        /**********
         * Longitude and Latitude
         ***********/ 

        if (!Number.isNaN(incident.geo_x) && incident.geo_x !='0.0' && incident.geo_x !='0.00')
          incidentDoc.longitude = incident.geo_x;
        else 
          incidentDoc.longitude = NaN;

        if (!Number.isNaN(incident.geo_y) && incident.geo_y !='0.0' && incident.geo_y !='0.00')
          incidentDoc.latitude = incident.geo_y;
        else 
          incidentDoc.latitude = NaN;

        IncidentsRealTime.update(
          incidentDoc, 
          { $set: {updated_at : new Date(),level:level},
            $setOnInsert: { created_at: new Date(), date: date}
          },
          { upsert:true }
        );


        IncidentsWeek.update(
          incidentDoc, 
          { $set: {updated_at : new Date(),level:level},
            $setOnInsert: { created_at: new Date(), date: date}
          },
          { upsert:true }
        );

      });

      var now = new Date();
      var noUpdatedRemoveQuery= {updated_at: {$lte: new Date(now - s.rt_incidents_update_interval)}}
      //var noTodayRemoveQuery= {updated_at: {$lt: new Date(now - s.rt_incidents_update_interval+1000)}}

      IncidentsRealTime.remove( noUpdatedRemoveQuery );

      var weekRemoveQuery= { 
        $or : [ 
          { date: {$gt : now}}, 
          { date: {$lt: new Date( now - 1000*60*60*24*7)}}
        ]
      }
            //var query= {createdAt: {$lt: new Date("2015-12-31"), $gt: new Date("2015-01-01")}}

      //IncidentsWeek.remove( weekRemoveQuery );

      console.log('Real Time Incidents 2 updated ('+ res.length +' incidents).');

    })
  },


  getIncidentsHistorical: function() {
    this.unblock();

    console.log('Bai');
    var today = new Date();

    var url = 'http://www.trafikoa.net/servicios/IncidenciasTDT/IncidenciasTrafikoTDTHist?fechaIni=20150902&fechaFin=' + moment(today).format('YYYYMMDD');
    //var url = 'http://www.trafikoa.net/servicios/IncidenciasTDT/IncidenciasTrafikoTDTGeo';
    
    console.log(url);
    var response = HTTP.call('GET', url, {
      encoding: null, // get content as binary data
      responseType: 'buffer' // get it as a buffer
    });
    console.log('response');

    var result = iconv.decode(response.content,'iso-8859-1');
    return result;

  },


  updateIncidentsHistorical: function() {
    Meteor.call('getIncidentsHistorical', function(err, res) {
      var data = xml2js.parseStringSync(res).raiz.incidenciaGeolocalizada;
      _.each(data,function(incident) {

        var incidentDoc = {};
        
        // type
        if (incident.tipo[0] == 'Accidente')
          incidentDoc.type = 'accident';
        else if (incident.tipo[0] == 'Obras')
          incidentDoc.type = 'roadwork';
        else if (incident.tipo[0] == 'Seguridad vial')
          incidentDoc.type = 'road_safety';
        else if (incident.tipo[0] == 'Pruebas deportivas')
          incidentDoc.type = 'sport';
        else if (incident.tipo[0] == 'Puertos de montaña')
          incidentDoc.type = 'port';
        else if (incident.tipo[0] == 'Vialidad invernal tramos')
          incidentDoc.type = 'winter_road';
        else if (incident.tipo[0] == 'Meteorológica')
          incidentDoc.type = 'weather';
        else if (incident.tipo[0] == 'Retención')
          incidentDoc.type = 'jam';
        else if (incident.tipo[0] == 'Otras incidencias')
          incidentDoc.type = 'other_incidents';
        else {
          console.log('Unknown incident type: ' + incident.tipo[0]);
          incidentDoc.type = 'other_incidents';
        }


        // 
        if (!Number.isNaN(incident.autonomia) && incident.autonomia !='')
          incidentDoc.autonomy = _.titleize(incident.autonomia[0]);

        if (!Number.isNaN(incident.provincia) && incident.provincia !='') {
          if (incident.provincia[0] == 'Alava-Araba' || incident.provincia[0] == 'ARABA')
            incidentDoc.province = 'Araba';
          else
          incidentDoc.province = _.titleize(incident.provincia[0]);
        }
        if (!Number.isNaN(incident.matricula) && incident.matricula !='')
          incidentDoc.matricula = incident.matricula[0];

        if (!Number.isNaN(incident.causa) && incident.causa !='')
          incidentDoc.cause = _.titleize(incident.causa[0]);

        if (!Number.isNaN(incident.poblacion) && incident.poblacion !='')
          incidentDoc.town = incident.poblacion[0];

        if (!Number.isNaN(incident.fechahora_ini) && incident.fechahora_ini !='' && incident.tipo !='Pruebas deportivas')

          incidentDoc.date = new Date( incident.fechahora_ini[0].substr(0,10) );
        else 
          incidentDoc.date = NaN;
      

        if (!Number.isNaN(incident.nivel) && incident.nivel !='')
          var level = incident.nivel[0];

        if (!Number.isNaN(incident.carretera) && incident.carretera !='')
          incidentDoc.road = incident.carretera[0];

        if (!Number.isNaN(incident.sentido) && incident.sentido !=''){
          var nameWords = _.words(incident.sentido[0],'/');
          if ( nameWords.length>1)
            var name = _.join('/',_.titleize(nameWords[0]),_.titleize(nameWords[1]));
          else
            var name = _.titleize(nameWords);
          incidentDoc.sense = name;
        }

        if (incident.tipo == 'Pruebas deportivas') {

          var romanRegExp = new RegExp('^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$');
          var romanNumber = null;
          var splitName = _.words(incident.nombre[0]);
          var sportName = '';

          _.each(splitName,function(word){

            sWord = word.replace('.', '');

            if (romanRegExp.exec(sWord)!=null)
              sportName = _.join(' ', _.clean(sportName),word);
            else 
              sportName = _.join(' ', _.clean(sportName), _.titleize(word) );

          });
          
          incidentDoc.name = sportName;

        }

        if (!Number.isNaN(incident.pk_inicial) && incident.pk_inicial !='')
          incidentDoc.kp_initial = incident.pk_inicial[0];
        else 
          incidentDoc.kp_initial = NaN;

        if (!Number.isNaN(incident.pk_final) && incident.pk_final !='')
          incidentDoc.kp_final = incident.pk_final[0];
        else 
          incidentDoc.kp_final = NaN;

        if (!Number.isNaN(incident.longitud) && incident.longitud !='0.0' && incident.longitud !='0.00')
          incidentDoc.longitude = incident.longitud[0];
        else 
          incidentDoc.longitude = NaN;

        if (!Number.isNaN(incident.latitud) && incident.latitud !='0.0' && incident.latitud !='0.00')
          incidentDoc.latitude = incident.latitud[0];
        else 
          incidentDoc.latitude = NaN;

        IncidentsHistorical.update(
          incidentDoc, 
          { $set: {updated_at : new Date(),level:level},
            $setOnInsert: { created_at: new Date()}
          },
          { upsert:true }
        );

      });

      console.log('Historical Incidents updated ('+ data.length +' incidents).');

    })
  },

  updateDailyStats: function() {

    var now = new Date();
      
      var dailystats = IncidentsHistorical.aggregate([
            { 
            $match: {
              date: {$lte: now , $gte: new Date(now - 1000*60*60*24*365)}}
            },
          {$group: {
              _id: {
                type : "$type",
                province: "$province",
                day: {$dayOfMonth: '$date'},
                month: {$month: '$date'},
                year: {$year: '$date'}
              },
              count: {$sum: 1}
            }
          },
          {$project : {
            _id: 0,
            type: "$_id.type",
            province: "$_id.province",
            day: "$_id.day",
            month: "$_id.month",
            year: "$_id.year" ,
            count: "$count"}
          }
          ]);

			    dailystats.forEach(function(stat) {
            var date = stat.year + '-' + stat.month + '-' + stat.day
            stat.date = new Date(date).valueOf()

            IncidentsDailystats.update(
              { type: stat.type,
                province: stat.province,
                date: stat.date
              }, 
              { $set: {count : stat.count || 0} },
              { upsert:true }
            );
          });
          console.log('Daily incidents stats updated.');
  },
  
  updateHourlyStats: function() {

    var now = new Date();
      
      var hourlystats = IncidentsWeek.aggregate([
            { 
            $match: {
              /*
               $and : [
                 {date: {$lte: now }}, 
                 { date: {$gte: new Date(now - 1000*60*60*24)}}
               ]
            }
            */
              date: {$lte: now , $gte: new Date(now - 1000*60*60*24)}}
            },
            //{$project : {hour_of_day: {$hour : '$date'}}},
          {$group: {
              _id: {
                type : "$type",
                province: "$province",
                hour_of_day: {$hour : '$date'}
              },
              count: {$sum: 1}}
          },
          {$project : {
            _id: 0,
            type: "$_id.type",
            province: "$_id.province",
            hour_of_day: "$_id.hour_of_day",
            count: "$count"}
          }
          ]);

			    hourlystats.forEach(function(stat) {
            var date = stat.year + '-' + stat.month + '-' + stat.day + '08:00:00'
            stat.date = new Date(date).valueOf()

            IncidentsHourlystats.update(
              { type: stat.type,
                province: stat.province,
                hour_of_day: stat.hour_of_day
              }, 
              { $set: {count : stat.count || 0} },
              { upsert:true }
            );
          });

          console.log('Hourly incidents stats updated.');
  },

 updateMonthlyStats: function() {
    var now = new Date();
      
      var dailystats = IncidentsHistorical.aggregate([
            { 
            $match: {
              date: {$lte: now , $gte: new Date(now - 1000*60*60*24*365)}}
            },
          {$group: {
              _id: {
                type : "$type",
                province: "$province",
                month: {$month: '$date'},
                year: {$year: '$date'}
              },
              count: {$sum: 1}
            }
          },
          {$project : {
            _id: 0,
            type: "$_id.type",
            province: "$_id.province",
            month: "$_id.month",
            year: "$_id.year" ,
            count: "$count"}
          }
          ]);

			    dailystats.forEach(function(stat) {
            var date = stat.year + '-' + stat.month + '-' + '01 08:00:00'
            stat.date = new Date(date).valueOf()

            IncidentsDailystats.update(
              { type: stat.type,
                province: stat.province,
                date: stat.date
              }, 
              { $set: {count : stat.count || 0} },
              { upsert:true }
            );
          });
          console.log('Monthly incidents stats updated.');

  }


});
