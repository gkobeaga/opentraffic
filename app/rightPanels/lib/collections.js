if (Meteor.isClient) {
	RightPanelGeoInfo = new Mongo.Collection('right_panel_geo_info')
	RightPanelPopInfo = new Mongo.Collection('right_panel_pop_info')
	RightPanelIncientsInfo = new Mongo.Collection('right_panel_incidents_info')

	RightPanelGraphData = new Mongo.Collection('right_panel_graph_data')

	RightPanelRoads = new Mongo.Collection('right_panel_roads')
}
