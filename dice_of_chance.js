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
		//turn
		//for each player:
			//reinforcements, roll(10)
			//initiative, roll(10) 
			//enable troops to form squads
			//decide on clones
				//decide number of clones
				//decide which troop is cloned
			//initialize new troops
			//A: make / break up squads
			//B: move units
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
		player.squads = [];
		if (player.troops.length > 1) {
			var new_squad = new squad();
			var squad_troops = [];
			squad_troops.push(player.troops[0]);
			squad_troops.push(player.troops[1]);
			new_squad.recalculate(squad_troops, p, 0);
			player.squads.push(new_squad);
		}

		populate_troop_table(p);
		populate_squad_table(p);
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

	this.recalculate = function (troops, player_id, squad_id) {
		this.troops = troops;

		var pplus = player_id - 0 + 1;
		var splus = squad_id - 0 + 1;
		this.name = "p"+pplus+"-s"+splus;

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

var color_cell = function (cell, value) {
	cell.innerHTML = value;
	cell.style.backgroundColor = "#"+ (11-value-1) + "" + (value-1) + "" + (Math.floor(value/2));
	cell.style.color = "#FFF";
}

var populate_troop_table = function (player_id) {
	var table = document.getElementById("troop_table"+player_id);
	for (t in players[player_id].troops) {
		var troop = players[player_id].troops[t];
		var row = table.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.innerHTML = troop.name
		var cell = row.insertCell(-1);
		color_cell(cell, troop.hit_points);
		var cell = row.insertCell(-1);
		color_cell(cell, troop.attack);
		var cell = row.insertCell(-1);
		color_cell(cell, troop.armour);
		var cell = row.insertCell(-1);
		color_cell(cell, troop.range);
		var cell = row.insertCell(-1);
		color_cell(cell, troop.line_of_sight);
		var cell = row.insertCell(-1);
		color_cell(cell, troop.agility);
		var cell = row.insertCell(-1);
		color_cell(cell, troop.accuracy);
		var cell = row.insertCell(-1);
		color_cell(cell, troop.speed);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "attacker";
		button.onclick = function () {attacker(troop)};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "target";
		button.onclick = function () {target(troop)};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		cell.innerHTML = "none";
		var cell = row.insertCell(-1);
		cell.innerHTML = "<input type='checkbox'></input>";

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "clone";
		button.onclick = function () {clone_troop(troop)};
		cell.appendChild(button);
	}
};

var populate_squad_table = function (player_id) {
	var table = document.getElementById("squad_table"+player_id);
	for (s in players[player_id].squads) {
		var squad = players[player_id].squads[s];
		var row = table.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.innerHTML = squad.name
		var cell = row.insertCell(-1);
		color_cell(cell, squad.hit_points);
		var cell = row.insertCell(-1);
		color_cell(cell, squad.attack);
		var cell = row.insertCell(-1);
		color_cell(cell, squad.armour);
		var cell = row.insertCell(-1);
		color_cell(cell, squad.range);
		var cell = row.insertCell(-1);
		color_cell(cell, squad.line_of_sight);
		var cell = row.insertCell(-1);
		color_cell(cell, squad.agility);
		var cell = row.insertCell(-1);
		color_cell(cell, squad.accuracy);
		var cell = row.insertCell(-1);
		color_cell(cell, squad.speed);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "attacker";
		button.onclick = function () {attacker(squad)};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "target";
		button.onclick = function () {target(squad)};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		cell.innerHTML = squad.troops.length;

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "break up";
		button.onclick = function () {break_up(squad)};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "clone";
		button.onclick = function () {clone_squad(squad)};
		cell.appendChild(button);
	}
};

var demo = {};

var break_up = function (squad) {
	alert("can not yet break up squads");
	//remove squad from player squads
	//remove row from table
	//update affected troop rows
	//clear demo fight
	//update affected squad rows (id, name)
};
var clone_squad = function (squad){
	alert("can not yet clone squads");
	//clone troops in squad
	//add to player troops
	//add rows to troop table
	//clone squad, but with new troops
	//add to player squads
	//add row to squad table

};
var clone_troop = function (troop) {
	alert("can not yet clone troops");
	//clone troop
	//add to player troop
	//add row to troop table
};
var form_squad = function (troops) {
	alert("can not yet form squads");
	//check to see if 2-4 are selected
	//create squad
	//update affected troop rows
	//disable buttons, checkboxes, update text
	//add squad to player squads
	//add row to squad table
};
var new_troop = function (player_id) {
	alert("can not yet get new troop");
	//create troop
	//add to player troops
	//add row to troop table
};

var kill_troop = function (squad) {
	alert("can not yet kill troop");
	//delete troops
	//remove troop rows
};

var kill_squad = function (squad) {
	alert("can not yet kill squad");
	//delete troops
	//remove troop rows
	//delete squad
	//remove squad row
};

var attacker = function(attacker) {
	demo.attacker = attacker;
	simulate_attack();
};
var target = function(target) {
	demo.target = target;
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