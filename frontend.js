var color_cell = function (cell, value) {
	cell.innerHTML = value;
	cell.style.backgroundColor = "#"+ (11-value-1) + "" + (value-1) + "" + (Math.floor(value/2));
	cell.style.color = "#FFF";
}

var populate_troop_table = function (player_id) {
	var table = document.getElementById("troop_table"+player_id);
	
	var row, r;
	for (r = 1; r < table.rows.length;) {
		table.deleteRow(r);
	}

	var player = players[player_id];
	var troops = player.troops;

	var troop, t;
	for (t = 0; t < troops.length; t++) {
		var troop = troops[t];
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

		var in_squad = troop.squad_id;
		var squad_name;
		if (in_squad == undefined) {
			squad_name = "none";
		} else {
			squad_name = player.squads[troop.squad_id].name;
		}
		var id = t;

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "attacker";
		button.onclick = function () {
			attacker(player_id, "troop", get_unit_id_from_element(this));
		};
		if (in_squad != undefined)
			button.disabled = "disabled";
		cell.appendChild(button);


		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "target";
		button.onclick = function () {
			target(player_id, "troop", get_unit_id_from_element(this));
		};
		if (in_squad != undefined)
			button.disabled = "disabled";
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		cell.innerHTML = squad_name;

		var cell = row.insertCell(-1);
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		if (in_squad != undefined)
			checkbox.disabled = "disabled";
		cell.appendChild(checkbox);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "clone";
		button.onclick = function () {click_clone_troop(this)};
		if (in_squad != undefined)
			button.disabled = "disabled";
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "kill";
		button.onclick = function () {click_kill_troop(this)};
		if (in_squad != undefined)
			button.disabled = "disabled";
		cell.appendChild(button);
	}
};

var populate_squad_table = function (player_id) {
	var table = document.getElementById("squad_table"+player_id);

	var row, r;
	for (r = 1; r < table.rows.length;) {
		table.deleteRow(r);
	}

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

		var id = s;

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "attacker";
		button.onclick = function () {
			attacker(player_id, "squad", get_unit_id_from_element(this));
		};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "target";
		button.onclick = function () {
			target(player_id, "squad", get_unit_id_from_element(this));
		};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		cell.innerHTML = squad.troops.length;

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "break up";
		button.onclick = function () {click_break_up(this)};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "clone";
		button.onclick = function () {click_clone_squad(this)};
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "kill";
		button.onclick = function () {click_kill_squad(this)};
		cell.appendChild(button);
	}
};

var demo = {};

var attacker = function (player_id, type, id) {
	set_attacker(player_id, type, id);
	check_target();
	simulate_attack();
};
var target = function (player_id, type, id) {
	set_target(player_id, type, id);
	check_attacker();
	simulate_attack();
};

var check_attacker = function () {
	var player_id = demo.attacker.player_id;
	var unit_id = demo.attacker.unit_id;
	var unit_type = demo.attacker.unit_type;
	var attacker = get_unit(player_id, unit_type, unit_id);

	if (demo.attacker != attacker)
		return false;
	if (attacker.unit_type == "troop")
		if (attacker.squad_id != undefined)
			return false;

	return true;
}
var check_target = function () {
	var player_id = demo.target.player_id;
	var unit_id = demo.target.unit_id;
	var unit_type = demo.target.unit_type;
	var target = get_unit(player_id, unit_type, unit_id);

	if (demo.target != target)
		return false;
	if (target.unit_type == "troop")
		if (target.squad_id != undefined)
			return false;

	return true;
}

var set_attacker = function (player_id, type, id) {
	demo.attacker = get_unit(player_id, type, id);
};
var set_target = function (player_id, type, id) {
	demo.target = get_unit(player_id, type, id);
};

var simulate_attack = function () {
	var battle_label = document.getElementById("battle_label");

	if (!check_attacker()) {
		battle_label.innerHTML = "select new attacker";
		return;
	} 
	if (!check_target()) {
		battle_label.innerHTML = "select new target";
		return;
	}

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


var click_form_squad = function (e) {
	var table = e.parentElement.parentElement.parentElement.parentElement;

	var player_id = get_player_id_from_element(e);
	var player = players[player_id];
	var troops = [];
	var row, r;
	for (r = 1; r < table.rows.length; r++) {
		row = table.rows[r];
		//todo: fix
		var checkbox = row.cells[12].firstChild;
		if (checkbox.checked) {
			troops.push(player.troops[r-1]);
		}
	}

	if (troops.length < 2 || troops.length > 4) {
		alert("Squads must be made of 2, 3, or 4 troops.");
	} else {
		form_squad(troops, player_id);
	}
};

var get_unit_id_from_element = function (e) {
	var table = e.parentElement.parentElement.parentElement.parentElement;
	var row = e.parentElement.parentElement;
	var id = row.rowIndex - 1;
	return id;
};

var get_player_id_from_element = function (e) {
	var table = e.parentElement.parentElement.parentElement.parentElement;
	var player_id = table.getAttribute("data-player_id");
	return player_id;
};

var click_break_up = function (e) {
	var player_id = get_player_id_from_element(e);
	var squad_id = get_unit_id_from_element(e);

	break_up(player_id, squad_id);
};

var click_new_troop = function (e) {
	var player_id = get_player_id_from_element(e);
	make_new_troop(player_id);
};

var click_new_squad = function (e) {
	var player_id = get_player_id_from_element(e);

	var size = prompt("How many troops - 2, 3, or 4?");
	size = parseInt(size);
	if (isNaN(size)) {
		alert("Invalid number.  Try again.");
	} else if (size < 2 || size > 4) {
		alert("Squads must be made of 2, 3, or 4 troops.");
	} else {
		make_new_squad(player_id, size);
	}
};

var click_clone_troop = function (e) {
	var player_id = get_player_id_from_element(e);
	var troop_id = get_unit_id_from_element(e);

	clone_troop(player_id, troop_id);
};

var click_clone_squad = function (e) {
	var player_id = get_player_id_from_element(e);
	var squad_id = get_unit_id_from_element(e);

	clone_squad(player_id, squad_id);
};

var click_kill_troop = function (e) {
	var player_id = get_player_id_from_element(e);
	var troop_id = get_unit_id_from_element(e);

	kill_troop(player_id, troop_id);
};

var click_kill_squad = function (e) {
	var player_id = get_player_id_from_element(e);
	var squad_id = get_unit_id_from_element(e);

	kill_squad(player_id, squad_id);
};


var update_player_initiative = function (player_id) {
	var player = players[player_id];
	var label = document.getElementById("player_initiative"+player_id);
	label.innerHTML = "Player " + (player_id  - 0 + 1) + " initiative points: " + player.initiative_points;
};

var update_player_reinforcements = function (player_id) {
	var player = players[player_id];
	var label = document.getElementById("player_reinforcements"+player_id);
	label.innerHTML = "Player " + (player_id - 0 + 1) + " reinforcement points: " + player.reinforcement_points;
};

var set_up_grenade_table = function () {
	var table = document.getElementById("grenade_table");

	var row, r;
	for (r = 0; r < 3; r++) {
		var row = table.insertRow(-1);

		var cell, c;
		for (c = 0; c < 3; c++) {
			var cell = row.insertCell(-1);
			cell.style.width = "33%";
			cell.style.height = "33%";

			if (r == 1 && c == 1) {
				cell.innerHTML = "Target Enemy";
			} else {
				var input = document.createElement("input");
				input.type = "checkbox";
				input.value = "Enemy";
				cell.appendChild(input);
			}
		}
	}

};

var click_throw_grenade = function () {
	var table = document.getElementById("grenade_table");

	var will_hit = [];
	var might_hit = [];
	var empty_spaces = [];

	var row, r;
	for (r = 0; r < 3; r++) {
		var row = table.rows[r];

		var cell, c;
		for (c = 0; c < 3; c++) {
			var cell = row.cells[c];
			cell.style.backgroundColor = "#8F8";

			var card = {col:c, row:r};
			if (r == 1 && c == 1) {
				will_hit.push(card);
			} else {
				var input = cell.firstChild;
				if (input.checked) {
					might_hit.push(card);
				} else {
					empty_spaces.push(card);
				}
			}
		}
	}

	var hits = roll(8);

	shuffleArray(might_hit);
	shuffleArray(empty_spaces);

	var enemy_hits;

	if (hits == 0) {
		//don't do anything
		enemy_hits = 0;
	} else if (hits > might_hit.length) {
		//add all might hit to will hit
		will_hit = will_hit.concat(might_hit);
		//add remainder number of empty spaces to will hit
		var will_hit_empty_spaces = empty_spaces.slice(0, hits - might_hit.length);

		enemy_hits = will_hit.length;
		will_hit = will_hit.concat(will_hit_empty_spaces);
	} else if (hits == might_hit.length) {
		//add all might hit to will hit
		will_hit = will_hit.concat(might_hit);
		enemy_hits = will_hit.length;

	} else if (hits < might_hit.length) {
		//add the first few might hit to will hit
		var will_hit_enemy_spaces = might_hit.slice(0, hits - might_hit.length);

		will_hit = will_hit.concat(will_hit_enemy_spaces);
		enemy_hits = will_hit.length;

	}

	var hit, h;
	for (h = 0; h < will_hit.length; h++) {
		hit = will_hit[h];
		var cell = table.rows[hit.row].cells[hit.col];
		cell.style.backgroundColor = "#F88";
	}

	var grenade_label = document.getElementById("grenade_label");
	grenade_label.innerHTML = "" + might_hit.length + " surrounding enemies<br />";
	grenade_label.innerHTML += " player rolled " + hits + "<br />";
	grenade_label.innerHTML += enemy_hits - 1 + " of them were hit";


};

