// this happens after someone has won and game has been over for some time
// reset database
// stop cue
// close registration and login
// send reminder to admin

Cue.addJob('checkForGameReset', {retryOnError:false, maxMs:1000*60*5}, function(task, done) {
    checkForGameReset();
    done();
});


var checkForGameReset = function() {
    var setting = Settings.findOne({name:'gameResetDate'});
    if (setting && setting.value !== null) {
        var gameReset = moment(new Date(setting.value));
        if (gameReset.isValid()) {
            //var resetDate = gameOver.add(s.gameOverPhaseTime, 'ms');
            if (moment().isAfter(gameReset)) {
                startResetGame();
            }
        }
    }
};



// stop job queue and give it time to finish
// so that a job doesn't finish after db has been dropped and insert something
var startResetGame = function() {
    console.log('--- starting reset game ---');

	Cue.pause();
	Cue.dropTasks();

    var delay = 1000*60*5;
    if (process.env.NODE_ENV == 'development') {
        delay = 1000*15;
    }

    // delay 5 min
    Meteor.setTimeout(function() {
        resetGame();
        Cue.unpause();
        console.log('--- finished reseting game ---');
    }, delay);
};


var resetGame = function() {
    console.log('--- resetting game ---');

    var startDate;
    var gameName;
    var gameDescription;

    // figure out start date for next game
    // can be changed in settings later
    var setting = Settings.findOne({name:'gameOverDate'});
    if (setting && setting.value !== null) {
        var gameOver = moment(new Date(setting.value));
        var resetDate = gameOver.add(s.gameOverPhaseTime, 'ms');
        startDate = resetDate.add(s.gameClosedPhaseTime, 'ms');
    }

    // keep game name and description for next game
    setting = Settings.findOne({name:'gameName'});
    if (setting) {
        gameName = setting.value;
    }

    setting = Settings.findOne({name:'gameDescription'});
    if (setting) {
        gameDescription = setting.value;
    }

    if (!startDate || !gameName || !gameDescription) {
        console.error('could not reset game.');
    }

    Cue.resetStats();
    Alerts.remove({});
    Armies.remove({});
    Markers.remove({});
    MarkerGroups.remove({});
    Battles2.remove({});
    Rounds.remove({});
    Castles.remove({});
    Charges.remove({});
    Meteor.users.remove({});
    Dailystats.remove({});
    Gamestats.remove({});
    GlobalAlerts.remove({});
    Hexbakes.remove({});
    Hexes.remove({});
    Market.remove({});
    Markethistory.remove({});
    Moves.remove({});
    Recentchats.remove({});
    Roomchats.remove({});
    Rooms.remove({});
    Settings.remove({});
    Villages.remove({});
    Reports.remove({});

    Settings.insert({name:'gameStartDate', value:startDate.toDate()});
    Settings.insert({name:'gameName', value:gameName});
    Settings.insert({name:'gameDescription', value:gameDescription});

    // let home base know that game has been reset
    landingConnection.call('gameReset', process.env.GAME_ID, process.env.DOMINUS_KEY);

    emailGameResetAlert();

    // must be called after landingConnection.gameReset
    setupNewGame();
};


// send email to admin letting them know that a game ended
var emailGameResetAlert = function() {
    var text = 'A game has reset.';

    Email.send({
        to: process.env.DOMINUS_ADMIN_EMAIL,
        from: process.env.DOMINUS_ADMIN_EMAIL,
        subject: 'Dominus Alert - Game '+process.env.GAME_ID+' Reset',
        text: text
    });
};
