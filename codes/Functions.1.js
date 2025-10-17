// Functions!
// index
// - HP Variables
// - Base Calculations
// - Regen Functions
// - Potion Functions
// - Toggle Hell
// - Attack Functions
// - Support Info Functions

// Base Variables

const TenMinutesInMs = 10 * 60 * 1000

// HP Variables

var MissingHP=character.max_hp-character.hp
var MissingMP=character.max_mp-character.mp



// Regen Functions

async function fUseHPRegen(){ 
	MissingHP=character.max_hp-character.hp
	if(!(is_on_cooldown("regen_hp"))){
		if(MissingHP>50&&(MissingHP<vHPPotionValue)&&vSupportDistance>170){
			use_skill("regen_hp")
			set_message("HP Regen","Red")
		}
	}
	setTimeout(fUseHPRegen, Math.max(1, ms_to_next_skill("regen_hp")));
};

async function fUseMPRegen(){
	MissingMP=character.max_mp-character.mp
	if(!(is_on_cooldown("regen_mp"))){
		if(MissingMP>100&&(MissingMP<vMPPotionValue)){
			use_skill("regen_mp")
			set_message("MP Regen","Blue")
		}
	}
	setTimeout(fUseMPRegen, Math.max(1, ms_to_next_skill("regen_mp")));
};

// Potion Functions

async function fUseHPPotion(){
	MissingHP=character.max_hp-character.hp
	if(!is_on_cooldown("use_hp")){
	//set_message("No Food Req");
		if(MissingHP>vHPPotionValue&&vSupportDistance>170){ //Figure out Missing Health
			//set_message("Eating");
			use_skill("use_hp");
			set_message("HP Potion","Red")
		}
	}
	setTimeout(fUseHPPotion, Math.max(1, ms_to_next_skill("use_hp")));
};

async function fUseMPPotion(){
	MissingMP=character.max_mp-character.mp
	if(!is_on_cooldown("use_mp")){
		if((MissingMP>vMPPotionValue||character.max_mp*0.10>character.mp)){ //Figure out Missing Mana
			use_skill("use_mp");
			set_message("MP Potion","Blue")
		}
	}
	setTimeout(fUseMPPotion, Math.max(1, ms_to_next_skill("use_mp")));
};

function fFindPotionValue(vPotionName){
	if(character.items[locate_item(vPotionName)]!=undefined){
		return(vPotionValue=G.items[character.items[locate_item(vPotionName)].name].gives[0][1]);
	} else {
		window.vAttackMode=false
		window.vHelpMode=false
	}
};

// Toggle Hell

// ----------------------
// Global toggles
// ----------------------
//var vEAXMPLE = false;
window.vAttackMode = false;
window.vHelpMode=false;
window.vFollow=false;
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
    game_log(varName + state);
}




// Support Info Functions

function fSupportDistance(vName){
	return(distance(parent.character,get_player(vName)))
}

function fSupportIsNear(vName) {
    return (distance(parent.character,get_player(vName))<=1000);
}
function fFollow(vName){
	if(vFollow){
		if(distance(parent.character,get_player(vName))>100&& fSupportIsNear(vName)==true)    {
			move(
				character.x+(get_player(vName).x-character.x)/2,
				character.y+(get_player(vName).y-character.y)/2
				);
			return(game_log("Following: "+vName,"#fe019a"));
		}
	}
}

