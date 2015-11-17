// settings per game

if (Meteor.isServer) {
    if (process.env.GAME_ID == 'andor') {
        s.castle.starting_garrison = {
            footmen: 2,
            archers: 12,
            pikemen: 12,
            cavalry: 2,
            catapults: 0
        };
        s.army_update_interval = 1000 * 15;	// how often does army movement job run
    }

    if (process.env.GAME_ID == 'speed') {
    }
}
