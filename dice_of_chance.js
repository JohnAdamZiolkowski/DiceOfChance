var flow = function () {

	//determine players
	players = [];
	players.push(new player());
	players.push(new player());
	determine_starting_troops(players);

set_attacker(0,0);
set_target(1,0);
simulate_attack();


	//round
		//Q: do the following two rolls apply to all players?
		//reinforcements, roll(10)
		//initiative, roll(10) 

		//turn
		//for each player:
			//enable troops to form squads
			//decide on clones
				//decide number of clones
				//decide which troop is cloned
			//initialize new troops
			//A: make / break up squads
			//B: move
			//C: attack
			//D: throw grenades
			//E: end turn

			//check to see if game is over

	//end game

};


var player = function () {
	this.troops;
	this.squads;
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

	populate_troop_table(p);
	}
	console.log(players);
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

	this.can_form_squad;

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
		this.can_form_squad = false;

		var pplus = player_id - 0 + 1;
		var tplus = troop_id - 0 + 1;
		this.name = "p"+pplus+"-t"+tplus;
	};

	this.clone = function () {
		var cloned_troop = new troop();
		cloned_troop.hit_points = troop.hit_points;
		cloned_troop.attack = troop.attack;
		cloned_troop.armour = troop.armour;
		cloned_troop.range = troop.range;
		cloned_troop.line_of_sight = troop.line_of_sight;
		cloned_troop.agility = troop.agility;
		cloned_troop.accuracy = troop.accuracy;
		cloned_troop.speed = troop.speed;
		cloned_troop.can_form_squad = false;
		return cloned_troop;
	};
};

var squad = function () {
	this.troops;

	var recalculate = function (troops) {
		this.troops = troops;

		for (t in troops) {
			if (this.hit_points < t.hit_points)
				this.hit_points = t.hit_points;
			if (this.attack < t.attack)
				this.attack = t.attack;
			if (this.armour < t.armour)
				this.armour = t.armour;
			if (this.range < t.range)
				this.range = t.range;
			if (this.line_of_sight < t.line_of_sight)
				this.line_of_sight = t.line_of_sight;
			if (this.agility < t.agility)
				this.agility = t.agility;
			if (this.accuracy < t.accuracy)
				this.accuracy = t.accuracy;
			if (this.speed < t.speed)
				this.speed = t.speed;
		}

		var speed_bonus;
		var agility_bonus;
		var attack_bonus;
		var range_bonus;

		if (troops.length = 2) {
			speed_bonus = - 1;
			agility_bonus = - 1;
			attack_bonus = + 1;
			range_bonus = + 1;
		} else if (troops.length = 3) {
			speed_bonus = - 1;
			agility_bonus = - 1;
			attack_bonus = + 2;
			range_bonus = + 1;
		} else if (troops.length = 4) {
			speed_bonus = - 2;
			agility_bonus = - 1;
			attack_bonus = + 2;
			range_bonus = + 2;
		}

		this.speed += speed_bonus;
		this.agility += agility_bonus;
		this.attack += attack_bonus;
		this.range += range_bonus;

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

	return results;
};

var grenade = function (tiles) {
	for (t in tiles) {
		roll(8);
	}
	//do something
};

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


var roll = function (max) {
	return Math.floor((Math.random() * max) + 1);
};



var populate_troop_table = function (player_id) {
	var table = document.getElementById("troop_table"+player_id);
	for (t in players[player_id].troops) {
		var troop = players[player_id].troops[t];
		var row = table.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.name
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.hit_points;
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.attack;
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.armour;
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.range;
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.line_of_sight;
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.agility;
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.accuracy;
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.speed;
		var cell = row.insertCell(-1);
		cell.innerHTML = "<button onclick=attacker("+player_id+","+t+")>attacker</button>";
		var cell = row.insertCell(-1);
		cell.innerHTML = "<button onclick=target("+player_id+","+t+")>target</button>";
	}
};

var demo = {};



var attacker = function(player_id, troop_id) {
	demo.attacker = players[player_id].troops[troop_id];
	simulate_attack();
};
var target = function(player_id, troop_id) {
	demo.target = players[player_id].troops[troop_id];
	simulate_attack();
};


var set_attacker = function(player_id, troop_id) {
	demo.attacker = players[player_id].troops[troop_id];
};
var set_target = function(player_id, troop_id) {
	demo.target = players[player_id].troops[troop_id];
};

var simulate_attack = function () {
	var battle_label = document.getElementById("battle_label");
	battle_label.innerHTML = demo.attacker.name + " attacks " + demo.target.name;
	
	var results = calculate_damage(demo.attacker, demo.target);

	if (results.hit) {
		battle_label.innerHTML += "<br>" + demo.attacker.name + " hits " + demo.target.name + " right on";
	} else {
		battle_label.innerHTML += "<br>" + demo.attacker.name + " misses " + demo.target.name + " by a mile";
	}


	if (results.blocked > 0 && results.damage == 0) {
		battle_label.innerHTML += "<br>" + demo.target.name + " blocked all " + results.blocked + " damage like a juggernaught";
	}
	else if (results.blocked > 0) {
		battle_label.innerHTML += "<br>" + demo.target.name + " blocked " + results.blocked + " damage";
	}

	if (results.damage > 0) {
		battle_label.innerHTML += "<br>" + demo.target.name + " took " + results.damage + " damage";
	} else {
		battle_label.innerHTML += "<br>" + demo.target.name + " is unscathed";
	}

	if (results.dead) {
		battle_label.innerHTML += "<br>" + demo.target.name + " died";
	} else {
		battle_label.innerHTML += "<br>" + demo.target.name + " lives on";
	}

};

