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


// Base Calculations

function ms_to_next_skill(skill) {
    const next_skill = parent.next_skill[skill]
    if (next_skill == undefined) return 0
    const ms = parent.next_skill[skill].getTime() - Date.now()
    return ms < 0 ? 0 : ms
}

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
	return(vPotionValue=G.items[character.items[locate_item(vPotionName)].name].gives[0][1]);
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


// Attack Functions
let vNearest;
let vCurrentTarget;
let vCurrentTargetHealth;

function fNextTarget(){
	if(vHelpMode||!vAttackMode || character.rip || is_moving(character)) {return;}
	vCurrentTarget=get_target();
	if(vCurrentTarget!=null){
		vCurrentTargetHealth=vCurrentTarget.hp;
	} else {
		vCurrentTargetHealth=0;
	}
	vNearest = get_nearest_monster({min_xp:vMinXP,max_att:vMaxAtt});
		if(vNearest==vCurrentTarget){return;}
		if(vNearest&&vCurrentTargetHealth<=0){
			vCurrentTarget=vNearest;
			change_target(vCurrentTarget);
		}
		if(!vCurrentTarget){
			set_message("No Monsters");
		}
}

async function fAttackLoop() {
    try {

		if(!(vHelpMode||vAttackMode) || character.rip || is_moving(character)||!can_attack(vCurrentTarget)||vCurrentTarget.name==parent.character.name){
		}
		else if (can_attack(vCurrentTarget)) {
            set_message("Attacking");
            await attack(vCurrentTarget);
            /** NOTE: We're now reducing the cooldown based on the ping */
            reduce_cooldown("attack", Math.min(...parent.pings));
		} 
	} catch (e) {
		//console.error(e)
	}
    setTimeout(fAttackLoop, Math.max(1, ms_to_next_skill("attack")));
}

async function fGoToTarget() {
	
	try {
		if(!(vHelpMode||vAttackMode) || character.rip || is_moving(character)) {return};
		if(!is_in_range(vCurrentTarget))
		{
			set_message("Moving to Target");
			move(
				character.x+(vCurrentTarget.x-character.x)/2,
				character.y+(vCurrentTarget.y-character.y)/2
			);
			// Walk half the distance
		}
	} catch (e) {
        console.error(e);
    }
};

async function fLoot(){
	try{
	loot();
	} catch (e) {
		console.error(e);
	}
	setTimeout(fLoot, 250);
}

function fSkillOnAllyTargeted(vName,vSkill){
	let vTarget=get_targeted_monster();
	let vEnemyTarget=fEnemyTarget(vTarget);
	let vEnemyTargetsSupport = vEnemyTarget.name===vName ? true : false;
	let vCoolDown=is_on_cooldown(vSkill);
	if(vCoolDown){
	set_message(vSkill+" on CD","Grey");
		return;
	}
	
	if(vEnemyTargetsSupport==false){return;}
	if(vEnemyTargetsSupport==true){
		set_message(vSkill,"Orange");
		use_skill(vSkill)
	}
}

function fUseSkill(vSkill){
	const vCD=is_on_cooldown(vSkill);
	const vIsInRange=is_in_range(vCurrentTarget,vSkill);
	
	if(!vAttackMode || character.rip || is_moving(character)) {return;}

	if(vCD==true){
		set_message(vSkill+" on CD","Grey");
		return;
	}
	if(!vIsInRange){return;}
	
	set_message(vSkill,"Orange");
	use_skill(vSkill);
}

function fUseAllyBuff(vBuff,vAlly){
	const vCD=is_on_cooldown(vBuff);
	const vIsInRange=is_in_range(vCurrentTarget,vBuff);
	const vAllyTarget=get_player(vAlly);
	const vAllyInRange=is_in_range(vAllyTarget,vBuff);
	let vAllyHasBuff;
	if(vAllyTarget&&vAllyInRange){
		if(character.rip || is_moving(character)) {
		} else if(vCD==true){
			set_message(vBuff+" on CD","Grey");
		} else {
			vAllyHasBuff=vAllyTarget.s[vBuff] ? true : false;
			if(!vAllyHasBuff){
				set_message(vBuff,"Orange");
				use_skill(vBuff,vAllyTarget);
			}
		}
	}
}
	

function fHelpPlayer(vName){
	if(!vHelpMode || vAttackMode || character.rip || is_moving(character)) {return;}
	vCurrentTarget=get_target();
	if(vCurrentTarget!=null){
		vCurrentTargetHealth=vCurrentTarget.hp;
	} else {
		vCurrentTargetHealth=0;
	}
	vNearest = get_target_of(get_player(vName));
		if(vNearest==vCurrentTarget){return;}
		if(vNearest&&vCurrentTargetHealth<=0){
			vCurrentTarget=vNearest;
			change_target(vCurrentTarget);
		}
		if(!vCurrentTarget){
			set_message("No Monsters");
	}
}


function fEnemyTarget(vTarget){
	if(get_target_of(vTarget)===null){
		return(false)
	}
	return(get_target_of(vTarget))
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

