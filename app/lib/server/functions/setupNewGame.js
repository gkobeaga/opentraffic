// run from create_castle
// when castle can't find any hexes to build castle on

setupNewGame = function() {
	console.log('--- creating new game ---');
	generate_hexes(8);
	reset_market();
	Settings.upsert({name: 'gameEndDate'}, {$set: {name: 'gameEndDate', value: null}});
	Settings.upsert({name: 'lastDominusUserId'}, {$set: {name: 'lastDominusUserId', value: null}});
	Settings.upsert({name: 'taxesCollected'}, {$set: {name:'taxesCollected', value:0}});
	Settings.upsert({name: 'hasGameOverAlertBeenSent'}, {$set: {name: 'hasGameOverAlertBeenSent', value:false}});
	Settings.upsert({name: 'isGameOver'}, {$set: {name: 'isGameOver', value:false}});
	Settings.upsert({name: 'gameOverDate'}, {$set: {name: 'gameOverDate', value:null}});
	Settings.upsert({name: 'gameResetDate'}, {$set: {name: 'gameResetDate', value:null}});

	// register game with base
	registerGame();
};
