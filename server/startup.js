Meteor.startup(function () {
    if (Population.find().count() == 0) {
      JSON.parse(Assets.getText("population.json")).forEach(function (doc) {
        console.log('Inserting population data.');
        Population.insert(doc);
      });
    }

    if (GeoInfo.find().count() == 0) {
        console.log('Inserting geographic data.');
      JSON.parse(Assets.getText("population.json")).forEach(function (doc) {
        GeoInfo.insert(doc);
      });
    }

    if (Provinces.find().count() == 0) {
        console.log('Inserting provinces toposon.');
      JSON.parse(Assets.getText("map_provinces.json")).forEach(function (doc) {
        Provinces.insert(doc);
      });
    }

    if (Roads.find().count() == 0) {
        console.log('Inserting roads toposon.');
      JSON.parse(Assets.getText("map_roads.json")).forEach(function (doc) {
        Provinces.insert(doc);
      });
    }
});
