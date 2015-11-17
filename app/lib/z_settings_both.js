// settings per game

/*
if (Meteor.settings.public.GAME_ID == 'krynn') {
  s.serverMaxPlayers = 500;
}

if (Meteor.settings.public.GAME_ID == 'andor') {
    s.village.max_can_have = 8;
    s.serverMaxPlayers = 300;
    s.army.stats = {
        footmen: {
            offense: 12,
            defense: 12,
            speed: 20
        },
        archers: {
            offense: 5,
            defense: 16,
            speed: 28
        },
        pikemen: {
            offense: 2,
            defense: 20,
            speed: 14
        },
        cavalry: {
            offense: 13,
            defense: 5,
            speed: 44
        },
        catapults: {
            offense: 1,
            defense: 1,
            speed: 4,
            bonus_against_buildings: 40
        }
    };
    s.village.cost = {
        level1: {
            grain: 200,
            lumber: 200,
            ore: 200,
            wool: 200,
            clay: 200,
            glass: 200,
            timeToBuild: 1000 * 60 * 30	// 30 min
        },
        level2: {
            grain: 400,
            lumber: 400,
            ore: 400,
            wool: 400,
            clay: 400,
            glass: 400,
            timeToBuild: 1000 * 60 * 60 * 3	// 6 hours
        },
        level3: {
            grain: 600,
            lumber: 600,
            ore: 600,
            wool: 600,
            clay: 600,
            glass: 600,
            timeToBuild: 1000 * 60 * 60 * 6 // 24 hours
        },
    };
}



if (Meteor.settings.public.GAME_ID == 'speed' || Meteor.settings.public.GAME_ID == 'katar') {
    s.battle_interval = 1000 * 60 * 1;
    s.village.max_can_have = 8;
    s.serverMaxPlayers = 300;
    s.resource.gained_at_hex = 4;
    
    s.army.stats.footmen.speed = Math.round(s.army.stats.footmen.speed * 3);
    s.army.stats.archers.speed = Math.round(s.army.stats.archers.speed * 3);
    s.army.stats.pikemen.speed = Math.round(s.army.stats.pikemen.speed * 3);
    s.army.stats.cavalry.speed = Math.round(s.army.stats.cavalry.speed * 3);
    s.army.stats.catapults.speed = Math.round(s.army.stats.catapults.speed * 3);

    s.village.cost.level1.timeToBuild = 1000 * 60 * 15;
    s.village.cost.level2.timeToBuild = 1000 * 60 * 60 * 3;
    s.village.cost.level3.timeToBuild = 1000 * 60 * 60 * 6;
}
*/
