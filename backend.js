//STARTED:
//initializing troops
//determining attack hit and damage
//cloning troops
//throwing grenade
//forming squads
//display troops
//display demo fight

//TODO:
//basic map grid
//placing units, moving
//turn order
//line of sight, team sight
//vehicles
//skills
//matchups
//bonuses
//specialization
//armament
//planet / country

var flow = function () {

	//determine players
	players = [];
	players.push(new player());
	players.push(new player());
	determine_starting_troops(players);

	set_attacker(0, "troop", 0);
	set_target(1, "troop", 0);
	simulate_attack();


	while (true) {

		var player_in_turn, p;
		for (p = 0; p < players.length; p++) {
			player_in_turn = players[p];

			//take turn

			//reinforcements, roll(10)
			player_in_turn.reinforcement_points = roll(10);
			update_player_reinforcements(p);

			//initiative, roll(10) 
			player_in_turn.initiative_points = roll(10);
			update_player_initiative(p);

			//DONE:
			//enable troops to form squads
			//decide on clones
				//decide number of clones
				//decide which troop is cloned
			//initialize new troops
			//A: make / break up squads
			
			//todo:
			//B: move units
			//C: attack
			//D: throw grenades
			//E: end turn

			//check to see if game is over
		}

		//todo: remove
		break;
	}

	//end game
};


var player = function () {
	this.troops;
	this.squads;
	this.reinforcement_points;
	this.initiative_points;
};

var determine_starting_troops = function (players) {
	for (p in players) {
		var player = players[p];
		var starting_troops = roll(10);
		player.troops = [];
		for (var t = 0; t < starting_troops; t++) {
			var new_troop = new troop();
			new_troop.initialize(p, t);
			player.troops.push(new_troop);
		}
		player.squads = [];

		populate_troop_table(p);
		populate_squad_table(p);
	}
	//do something
};


var troop = function () {
	this.hit_points;		//die at 0
	
	this.attack;			//negated by enemy armor
	this.armour;			//blocks enemy attack

	this.range;				//max attack distance
	this.line_of_sight;		//agility drops when attacking out of sight

	this.agility;			//dodge enemy attacks
	this.accuracy;			//hit agile enemies

	this.speed;				//travel distance, taxicab

	this.position = {};
	this.position.x;
	this.position.y;
	this.name;

	this.initialize = function (player_id, troop_id) {
		this.hit_points = roll(10);
		this.attack = roll(10);
		this.armour = roll(10);
		this.range = roll(10);
		this.line_of_sight = roll(10);
		this.agility = roll(10);
		this.accuracy = roll(10);
		this.speed = roll(10);

		var pplus = player_id - 0 + 1;
		var tplus = troop_id - 0 + 1;
		this.name = "p"+pplus+"-t"+tplus;
		this.player_id = player_id;
		this.unit_id = troop_id;
		this.unit_type = "troop";
	};

	this.rename = function (player_id, troop_id) {
		var pplus = player_id - 0 + 1;
		var tplus = troop_id - 0 + 1;
		this.name = "p"+pplus+"-t"+tplus;
		this.player_id = player_id;
		this.unit_id = troop_id;
	};

	this.clone = function (troop) {
		this.hit_points = troop.hit_points;
		this.attack = troop.attack;
		this.armour = troop.armour;
		this.range = troop.range;
		this.line_of_sight = troop.line_of_sight;
		this.agility = troop.agility;
		this.accuracy = troop.accuracy;
		this.speed = troop.speed;
	};
};

var squad = function () {
	this.troops;

	this.recalculate = function (troops, player_id, squad_id) {
		this.troops = troops;

		var pplus = player_id - 0 + 1;
		var splus = squad_id - 0 + 1;
		this.name = "p"+pplus+"-s"+splus;
		this.player_id = player_id;
		this.unit_id = squad_id;
		this.unit_type = "squad";

		var troop, t;
		for (t in troops) {
			troop = troops[t];
			if (t == 0) {
				this.hit_points = troop.hit_points;
				this.attack = troop.attack;
				this.armour = troop.armour;
				this.range = troop.range;
				this.line_of_sight = troop.line_of_sight;
				this.agility = troop.agility;
				this.accuracy = troop.accuracy;
				this.speed = troop.speed;
			}
			if (this.hit_points < troop.hit_points)
				this.hit_points = troop.hit_points;
			if (this.attack < troop.attack)
				this.attack = troop.attack;
			if (this.armour < troop.armour)
				this.armour = troop.armour;
			if (this.range < troop.range)
				this.range = troop.range;
			if (this.line_of_sight < troop.line_of_sight)
				this.line_of_sight = troop.line_of_sight;
			if (this.agility < troop.agility)
				this.agility = troop.agility;
			if (this.accuracy < troop.accuracy)
				this.accuracy = troop.accuracy;
			if (this.speed < troop.speed)
				this.speed = troop.speed;
		}

		var speed_bonus;
		var agility_bonus;
		var attack_bonus;
		var range_bonus;

		if (troops.length == 2) {
			speed_bonus = - 1;
			agility_bonus = - 1;
			attack_bonus = + 1;
			range_bonus = + 1;
		} else if (troops.length == 3) {
			speed_bonus = - 1;
			agility_bonus = - 1;
			attack_bonus = + 2;
			range_bonus = + 1;
		} else if (troops.length == 4) {
			speed_bonus = - 2;
			agility_bonus = - 1;
			attack_bonus = + 2;
			range_bonus = + 2;
		}

		this.speed += speed_bonus;
		this.agility += agility_bonus;
		this.attack += attack_bonus;
		this.range += range_bonus;

		if (this.speed < 1) this.speed = 1;
		if (this.agility < 1) this.agility = 1;
		if (this.attack > 10) this.attack = 10;
		if (this.range > 10) this.range = 10;

		//Q: if all troops have 1 SPD, can SPD be 0, -1?
		//Q: is the max number of troops in one squad 4?
	};
	//Q: "replaces same number of ITs as one unit"
};


var calculate_damage = function (attacker, defender, firing_blind) {

	var results = {}

	var hit = true;
	var dead = false;

	var damage = attacker.attack - defender.armour;
	var blocked = defender.armour - attacker.attack;
	if (damage < 0)
		damage = 0;
	if (defender.armour > attacker.attack)
		blocked = attacker.attack;
	else
		blocked = defender.armour;

	var accuracy = attacker.accuracy;
	if (firing_blind)
		accuracy = Math.floor(attacker.accuracy / 2)

	if (defender.agility > accuracy) {
		hit = false;
		damage = 0;
		blocked = 0;
	}

	if (damage >= defender.hit_points) {
		dead = true;
	}

	results.damage = damage;
	results.hit = hit;
	results.blocked = blocked;
	results.dead = dead;
	//results.extra_armour_when_compleyely_defended
	//results.extra_accuracy_when_hit
	//results.missed_by
	//results.overkill
	//results.health_remaining

	return results;
};

var grenade = function (tiles) {
	for (t in tiles) {
		roll(8);
	}
	//do something
};


var roll = function (max) {
	return Math.floor((Math.random() * max) + 1);
};

var break_up = function (player_id, squad_id) {

	var player = players[player_id];
	var squad = player.squads[squad_id];

	var troop, t;
	for (t = 0; t < squad.troops.length; t++) {
		troop = squad.troops[t];

		troop.squad_id = undefined;
	}

	player.squads.splice(squad.id, 1);

	for (t = 0; t < player.troops.length; t++) {
		troop = player.troops[t];
		troop.squad_id = undefined;
	}

	var squads = player.squads;
	var squad, s;
	for (s = 0; s < squads.length; s++) {
		squad = squads[s];
		squad.recalculate(squad.troops, player_id, s);

		//todo: move into recalculate
		for (t = 0; t < squad.troops.length; t++) {
			troop = squad.troops[t];
			troop.squad_id = s;
		}
	}

	populate_troop_table(player_id);
	populate_squad_table(player_id);
	simulate_attack();
};

var clone_troop = function (player_id, troop_id, paid) {
	var player = players[player_id];
	var troop = player.troops[troop_id];
	var new_troop_id = player.troops.length;

	if (! paid) {
		var cost = 2;
		if (player.reinforcement_points < cost) {
			alert("Not enough reinforcement points. " + cost + " are needed to clone this troop.");
			return;
		}
		player.reinforcement_points -= cost;
	}

	//create new troop
	make_new_troop(player_id, true);
	var new_troop = player.troops[new_troop_id];

	//clone stats over from old troop
	new_troop.clone(troop);

	//add row to troop table
	populate_troop_table(player_id);
	update_player_reinforcements(player_id);
};

var clone_squad = function (player_id, squad_id) {
	var player = players[player_id];
	var squad = player.squads[squad_id];
	var new_squad_id = player.squads.length;
	var squad_troops = squad.troops;

	var cost = squad.troops.length * 2;
	if (player.reinforcement_points < cost) {
		alert("Not enough reinforcement points.  " + cost + " are needed to clone this squad.");
		return;
	}
	player.reinforcement_points -= cost;

	var new_troops = [];

	var squad_troop, t;
	for (t = 0; t < squad_troops.length; t++) {
		//clone troops in squad
		squad_troop = squad_troops[t];
		var squad_troop_id = squad_troop.unit_id;
		clone_troop(player_id, squad_troop_id, true);

		//add new troops to a squad
		var new_troop_id = player.troops.length-1;
		new_troops.push(player.troops[new_troop_id]);
	}

	//create squad with cloned troops
	form_squad(new_troops, player_id);
};

var form_squad = function (troops, player_id) {
	var new_squad = new squad();
	var player = players[player_id];
	var squad_id = player.squads.length;
	new_squad.recalculate(troops, player_id, squad_id);

	var troop, t;
	for (t = 0; t < troops.length; t++) {
		troop = troops[t];

		if (troop.squad_id == undefined)
			troop.squad_id = squad_id;
		else {
			alert("Troops can not form two squads");
			return false;
		}
	}

	player.squads.push(new_squad);

	populate_troop_table(player_id);
	populate_squad_table(player_id);
	simulate_attack();
};

var make_new_troop = function (player_id, paid) {
	var player = players[player_id];
	var troop_id = player.troops.length;

	if (! paid) {
		var cost = 1;
		if (player.reinforcement_points < cost) {
			alert("Not enough reinforcement points.  " + cost + " is needed to train a new troop.");
			return;
		}
		player.reinforcement_points -= cost;
	}

	//make a new troop
	var new_troop = new troop();
	new_troop.initialize(player_id, troop_id);

	//add it to the player's team
	player.troops.push(new_troop);

	//update the ui
	populate_troop_table(player_id);
	update_player_reinforcements(player_id);
};

var make_new_squad = function (player_id, size) {
	var player = players[player_id];
	var squad_id = player.squads.length;

	var cost = size;
	if (player.reinforcement_points < cost) {
		alert("Not enough reinforcement points.  " + cost + " are needed to train a new squad of that size.");
		return;
	}
	player.reinforcement_points -= cost;

	var new_troops = [];
	var t; 
	for (t = 0; t < size; t++) {
		make_new_troop(player_id, true);
		var new_troop_id = player.troops.length-1;
		new_troops.push(player.troops[new_troop_id]);
	}

	form_squad(new_troops, player_id);
	populate_troop_table(player_id);
	populate_squad_table(player_id);
};

var kill_troop = function (player_id, troop_id) {
	var player = players[player_id];
	player.troops.splice(troop_id, 1);

	var troop, t;
	for (t = 0; t < player.troops.length; t++) {
		troop = player.troops[t];

		troop.rename(player_id, t);
	}

	populate_troop_table(player_id);
	simulate_attack();
};

var kill_squad = function (player_id, squad_id) {
	var player = players[player_id];
	var squad = player.squads[squad_id];
	
	var troop, t;
	for (t = 0; t < squad.troops.length; t++) {
		troop = squad.troops[t];

		kill_troop(player_id, troop.unit_id);
	}

	player.squads.splice(squad_id, 1);

	var squad_remaining, s;
	for (s = 0; s < player.squads.length; s++) {
		squad_remaining = player.squads[s];

		squad_remaining.recalculate(squad_remaining.troops, player_id, s);

		//todo: move into recalculate
		for (t = 0; t < squad_remaining.troops.length; t++) {
			troop = squad_remaining.troops[t];
			troop.squad_id = s;
		}
	}

	populate_troop_table(player_id);
	populate_squad_table(player_id);
	simulate_attack();
};

var get_unit = function (player_id, unit_type, unit_id) {
	var player = players[player_id];
	var unit;
	if (unit_type == "troop") {
		unit = player.troops[unit_id];
	} else if (unit_type == "squad") {
		unit = player.squads[unit_id];
	} else {
		alert("Error: invalid unit type")
	}
	return unit;
};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
