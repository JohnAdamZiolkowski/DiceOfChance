var flow = function () {

	//determine players

	determine_starting_troops(players);

	//round
		//Q: do the following two rolls apply to all players?
		//reinforcements, roll(10)
		//initiative, roll(10) 

		//turn
		//for each player:
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




var determine_starting_troops = function (players) {
	for (p in players) {
		roll(10);
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
	//Q: diagonals?

	this.can_form_squad;

	var initialize = function () {
		this.hit_points = roll(10);
		this.attack = roll(10);
		this.armour = roll(10);
		this.range = roll(10);
		this.line_of_sight = roll(10);
		this.agility = roll(10);
		this.accuracy = roll(10);
		this.speed = roll(10);
		this.can_form_squad = false;
	};

	var clone = function (troop) {
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

		for (troop t in troops) {
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

		if (troops.length = 2) {
			this.speed = this.speed - 1;
			this.agility = this.agility - 1;
			this.attack = this.attack + 1;
			this.range = this.range + 1;
		} else if (troops.length = 3) {
			this.speed = this.speed - 1;
			this.agility = this.agility - 1;
			this.attack = this.attack + 2;
			this.range = this.range + 1;
		} else if (troops.length = 4) {
			this.speed = this.speed - 2;
			this.agility = this.agility - 1;
			this.attack = this.attack + 2;
			this.range = this.range + 2;
		}

		//Q: if all troops have 1 SPD, can SPD be 0, -1?
		//Q: is the max number of troops in one squad 4?
	};
	//Q: "replaces same number of ITs as one unit"
};



var calculate_damage = function (attacker, defender, firing_blind) {

	var damage = attacker.attack - defender.armour;
	if (damage < 0)
		damage = 0;

	var accuracy = attacker.accuracy;
	if (firing_blind)
		accuracy = Math.floor(attacker.accuracy / 2)

	if (accuracy >= defender.agility)
		damage = 0;

	return damage;
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
