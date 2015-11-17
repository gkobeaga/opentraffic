Cue.addJob('checkForGameOver', {retryOnError:false, maxMs:1000*60*5}, function(task, done) {
    checkForGameOver();
    done();
});


// when someone becomes dominus gameEndDate is set
checkForGameOver = function() {
    var end = Settings.findOne({name: 'gameEndDate'});
    if (end && end.value !== null) {

        var endDate = moment(new Date(end.value));
        if (endDate && endDate.isValid()) {

            if (moment().isAfter(endDate)) {

                // game is over! yay!

                // we should send an alert for this!
                // has alert already been sent?
                // hasBeenSend makes sure this function isn't run twice
                var hasBeenSent = Settings.findOne({name:'hasGameOverAlertBeenSent'});

                if (!hasBeenSent || !hasBeenSent.value) {

                    // find who won
                    var winner = Meteor.users.findOne({is_dominus:true}, {fields:{_id:1, emails:1, username:1, x:1, y:1, castle_id:1}});

                    if (!winner) {

                        // if nobody is currently dominus see who was last dominus
                        var lastDominus = Settings.findOne({name: 'lastDominusUserId'});
                        if (lastDominus && lastDominus.value) {
                            winner = Meteor.users.findOne(lastDominus.value, {fields:{_id:1, emails:1, username:1, x:1, y:1, castle_id:1}});
                        }
                    }

                    if (winner) {
                        gameOver(winner);

                    } else {
                        console.error('Game is over but no dominus found.');
                    }
                }
            }
        }
    }
};


var gameOver = function(winner) {
    console.log('--- game over ---');

    gAlert_gameOver(winner._id);
    Settings.upsert({name: 'hasGameOverAlertBeenSent'}, {$set: {name: 'hasGameOverAlertBeenSent', value:true}});
    Settings.upsert({name: 'isGameOver'}, {$set: {name: 'isGameOver', value:true}});
    Settings.upsert({name: 'gameOverDate'}, {$set: {name: 'gameOverDate', value:new Date()}});

    // update everyone's profile with their rank
    Meteor.users.find({}, {fields: {emails:1}}).forEach(function(user) {

        var ds = Dailystats.findOne({user_id:user._id}, {fields: {incomeRank:1, vassalRank:1}, sort:{created_at:-1}});
        if (ds) {

            // update profile
            var options = {
                rankByIncome: ds.incomeRank,
                rankByVassals: ds.vassalRank
            };
            callLandingMethod('profile_setRankByIncome', user.emails[0].address, options);
            callLandingMethod('profile_setRankByVassals', user.emails[0].address, options);
        }
    });

    // go ahead and set game reset date and game start date here
    // so that we can override them manually in the admin panel if we want

    // this is the time when the game over popup will go away and the game will be reset
    var gameResetDate = moment().add(s.gameOverPhaseTime, 'ms').toDate();
    Settings.upsert({name: 'gameResetDate'}, {$set: {name: 'gameResetDate', value:gameResetDate}});

    // this is when the next game will start
    var gameStartDate = moment().add(s.gameOverPhaseTime, 'ms').add(s.gameClosedPhaseTime, 'ms').toDate();
    Settings.upsert({name: 'gameStartDate'}, {$set: {name: 'gameStartDate', value:gameStartDate}});

    // store who won for popup
    var winnerData = {
        _id:winner._id,
        username:winner.username,
        x:winner.x,
        y:winner.y,
        castle_id:winner.castle_id
        };

    Settings.upsert({name: 'winner'}, {$set: {name: 'winner', value:winnerData}});

    // update user's profile at home base
    var options = {};
    callLandingMethod('profile_wonGame', winner.emails[0].address, options);

    // let home base know that game is over
    landingConnection.call('gameHasEnded', process.env.GAME_ID, process.env.DOMINUS_KEY);



    // ------------------------------
    // record results
    var results = {};

    results.winner = {
        username:winner.username,
        email:winner.emails[0].address
    };

    // num vassals
    results.numVassals = [];
    var rank = 1;
    Meteor.users.find({}, {sort:{num_allies_below:-1}, fields:{emails:1, username:1, num_allies_below:1}, limit:10}).forEach(function(user) {
        var player = {
            username:user.username,
            rank:rank,
            email:user.emails[0].address,
            numVassals: user.num_allies_below
        };
        results.numVassals.push(player);
        rank++;
    });

    // by networth
    results.networth = [];
    rank = 1;
    Meteor.users.find({}, {sort:{"net.total": -1}, fields:{emails:1, username:1, "net.total":1}, limit:10}).forEach(function(user) {
        var player = {
            username:user.username,
            rank:rank,
            email:user.emails[0].address,
            networth: user.net.total
        };
        results.networth.push(player);
        rank++;
    });

    // by income
    results.income = [];
    rank = 1;
    Meteor.users.find({}, {sort:{income: -1}, fields:{emails:1, username:1, income:1}, limit:10}).forEach(function(user) {
        var player = {
            username:user.username,
            rank:rank,
            email:user.emails[0].address,
            income:user.income
        };
        results.income.push(player);
        rank++;
    });

    // by lostSoldiers
    results.lostSoldiers = [];
    rank = 1;
    Meteor.users.find({}, {sort:{losses_worth: -1}, fields:{emails:1, username:1, losses_worth:1, losses_num:1}, limit:10}).forEach(function(user) {
        var player = {
            username:user.username,
            rank:rank,
            email:user.emails[0].address,
            lostSoldiersWorth:user.losses_worth,
            lostSoldiersNum:user.losses_num
        };
        results.lostSoldiers.push(player);
        rank++;
    });

    // by villages
    results.villages = [];
    rank = 1;
    Villages.find({under_construction:false}, {sort:{"income.worth": -1}, fields:{emails:1, username:1, "income.worth":1}, limit:10}).forEach(function(village) {

        var player = {
            username:village.username,
            rank:rank,
            villageWorth:village.income.worth
        };

        var u = Meteor.users.findOne(village.user_id, {fields:{emails:1}});
        if (u) {
            player.email = u.emails[0].address;
        }

        results.lostSoldiers.push(player);
        rank++;
    });

    landingConnection.call('addResultsFromGame', process.env.GAME_ID, process.env.DOMINUS_KEY, results);

    emailGameOverAlert();
};


// send email to admin letting them know that a game ended
var emailGameOverAlert = function() {
    var text = 'A game has ended.';

    //mandrillSendTemplate('admin-game-over', process.env.DOMINUS_ADMIN_EMAIL, process.env.DOMINUS_ADMIN_EMAIL);

    Email.send({
        to: process.env.DOMINUS_ADMIN_EMAIL,
        from: process.env.DOMINUS_ADMIN_EMAIL,
        subject: 'Dominus Alert - Game '+process.env.GAME_ID+' Over',
        text: text
    });
};
