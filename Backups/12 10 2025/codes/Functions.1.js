// Functions!
// index
// - HP Variables
// - Regen Functions
// - Potion Functions
// - Toggle Hell
// - Attack Functions
// - Support Info Functions


// HP Variables

var MissingHP=character.max_hp-character.hp
var MissingMP=character.max_mp-character.mp


// Regen Functions

function fUseHPRegen(vPotionValue,vSupportDistance){ 
	if(!is_on_cooldown("regen_hp")){
		if(MissingHP>50&&(MissingHP<vPotionValue)&&vSupportDistance>170){
			use_skill("regen_hp")
			game_log("HP Reg")
		return;
		}
	}else{
	}
};

function fUseMPRegen(vPotionValue){
	if(!is_on_cooldown("regen_mp")){
		if(MissingMP>100&&(MissingMP<vPotionValue)){
			use_skill("regen_mp")
			game_log("MP Reg")
		return;
		}
	}
};

// Potion Functions

function fUseHPPotion(vPotionValue,vSupportDistance){
	if(!is_on_cooldown("use_hp")){
	//set_message("No Food Req");
		if(MissingHP>vPotionValue&&vSupportDistance>170){ //Figure out Missing Health
			//set_message("Eating");
			use_skill("use_hp");
			game_log("HP Pot")
			return;
		}
	}
};

function fUseMPPotion(vPotionValue){
	if(!is_on_cooldown("use_mp")){
	//set_message("No Food Req");
		if((MissingMP>vPotionValue||character.max_mp*0.10>character.mp)){ //Figure out Missing Mana
			//set_message("Eating");
			use_skill("use_mp");
			game_log("MP Pot")
			return;
		}
	}
};

function fFindPotionValue(vPotionName){
	return(vPotionValue=G.items[character.items[locate_item(vPotionName)].name].gives[0][1]);
};

// Toggle Hell

// ----------------------
// Global toggles
// ----------------------
//var vEAXMPLE = false;
var vAttackMode = false;
// Add more toggle variables here as needed

// ----------------------
// Key mapping helper
// ----------------------
function MapToggle(key, varName){
    // Maps the key to toggle the variable
    map_key(key, "snippet", "fToggleVar('" + varName + "')");
}
// ----------------------
// Toggle function
// ----------------------
function fToggleVar(varName){
    // Toggle the global variable using window[]
    window[varName] = !window[varName];
    
    // Optional: display on-screen message and log
    let state = window[varName] ? "ON" : "OFF";
    set_message(varName + ": " + state);
    game_log(varName + " toggled to " + state);
}


// Attack Functions

function fAttack(vAttackMode,vXP,vAtt){
	loot();
	
	if(!vAttackMode || character.rip || is_moving(character)) return;

	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:vXP,max_att:vAtt});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!is_in_range(target))
	{
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
	}
};

// Support Info Functions

function fSupportDistance(vName){
	return(distance(parent.character,get_player(vName)))
}