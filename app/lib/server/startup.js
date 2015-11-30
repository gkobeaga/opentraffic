Meteor.startup(function () {
    if (Population.find().count() == 0) {
        console.log('Inserting population data.');
      JSON.parse(Assets.getText("population.json")).forEach(function (doc) {
        Population.insert(doc);
      });
    }

    if (GeoInfo.find().count() == 0) {
        console.log('Inserting geographic data.');
      JSON.parse(Assets.getText("geo_info.json")).forEach(function (doc) {
        GeoInfo.insert(doc);
      });
    }

    if (Provinces.find().count() == 0) {
        console.log('Inserting provinces topojson.');
      JSON.parse(Assets.getText("map_provinces.json")).forEach(function (doc) {
        Provinces.insert(doc);
      });
    }

    if (Roads.find().count() == 0) {
        console.log('Inserting roads topojson.');
      JSON.parse(Assets.getText("map_roads.json")).forEach(function (doc) {
        Roads.insert(doc);
      });
    }
});
