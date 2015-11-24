if (Meteor.isClient) {
	RightPanelGeoInfo = new Mongo.Collection('right_panel_geo_info')
	RightPanelPopInfo = new Mongo.Collection('right_panel_pop_info')
	RightPanelIncientsInfo = new Mongo.Collection('right_panel_incidents_info')

	RightPanelRoads = new Mongo.Collection('right_panel_roads')
}
