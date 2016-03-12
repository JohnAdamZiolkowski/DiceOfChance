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

	for (t in players[player_id].troops) {
		var player = players[player_id];
		var troop = player.troops[t];
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

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "attacker";
		button.onclick = function () {attacker(troop)};
		if (in_squad != undefined)
			button.disabled = "disabled";
		cell.appendChild(button);

		var cell = row.insertCell(-1);
		var button = document.createElement("input");
		button.type = "button";
		button.value = "target";
		button.onclick = function () {target(troop)};
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
		button.onclick = function () {clone_troop(troop)};
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
		button.onclick = function () {click_break_up(this)};
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


var click_form_squad = function(e) {
	var table = e.parentElement.parentElement.parentElement.parentElement;

	//todo: fix, get from table
	var player_id = table.getAttribute("data-player_id");
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

	if (troops.length < 2 || troops.length > 4 ) {
		alert("Squads must be made of 2, 3, or 4 troops.");
	} else {
		form_squad(troops, player_id);
	}
}

var click_break_up = function(e) {
	var table = e.parentElement.parentElement.parentElement.parentElement;
	var player_id = table.getAttribute("data-player_id");
	var player = players[player_id];
	var row = e.parentElement.parentElement;
	var squad_id = row.rowIndex - 1;
	var squad = player.squads[squad_id];

	break_up(squad, player_id);
}


