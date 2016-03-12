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