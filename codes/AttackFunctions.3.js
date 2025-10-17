
// Base Calculations

function ms_to_next_skill(skill) {
    const next_skill = parent.next_skill[skill]
    if (next_skill == undefined) return 0
    const ms = parent.next_skill[skill].getTime() - Date.now()
    return ms < 0 ? 0 : ms
}

const vSelf=parent.character
let vCurrentTarget=get_target(vSelf)
let vNextTarget
let vProtectTarget
let vHelpTarget
let vProtectSelfTarget
let vNearestTarget

// Targeting Functions | Protecting Self / Player will always be priority even when current target still has health.
function aProtectPlayerTarget(vPlayerName){
	let vPlayer=get_player(vPlayerName);
	if (vPlayer===null){return;}
	if(get_nearest_monster({target:vPlayer})===null){return;} else {
	return(get_nearest_monster({target:vPlayer}));
	}
}
function aHelpTarget(vPlayerName){
	let vPlayer=get_player(vPlayerName);
	return(get_target_of(vPlayer));
}
function aProtectSelfTarget(){
	return(get_nearest_monster({target:vSelf}));
}
function aTargetNearest(){
	return(get_nearest_monster({min_xp:vMinXP, max_att:vMaxAtt,type:vType}));
}

function aSelectTarget(vPlayerName){
	vPlayerDistance=distance(vSelf,get_player(vPlayerName));
	vCurrentTarget=get_target(vSelf);
	vProtectTarget=aProtectPlayerTarget(vPlayerName);
	vHelpTarget=aHelpTarget(vPlayerName);
	vProtectSelfTarget=aProtectSelfTarget();
	vNearestTarget=aTargetNearest();

	const actions = [
	{
		name: "Protect Player",
		when: () =>
			vCurrentTarget !== vProtectTarget &&
			vProtectTarget?.type === "monster" &&
			vHelpMode &&
			vPlayerDistance < 300,
	do: () => {
		log("Protecting "+vPlayerName);
		change_target(vProtectTarget);
	},
	},
	{
		name: "Help Player",
		when: () =>
			vCurrentTarget !== vHelpTarget &&
			vHelpTarget?.type === "monster" &&
			vHelpMode &&
			!vAttackMode &&
			vPlayerDistance < 300 &&
			(vCurrentTarget?.hp <= 0 || vCurrentTarget===null || !is_in_range(vCurrentTarget)),
		do: () => {
			log("Helping "+vPlayerName);
			change_target(vHelpTarget);
			},
	},
	{
		name: "Protect Self",
		when: () =>
			vCurrentTarget !== vProtectSelfTarget &&
			vProtectSelfTarget?.type === "monster" &&
			vAttackMode,
		do: () => {
			log("Protecting Self");
			log(vProtectSelfTarget.name);
			change_target(vProtectSelfTarget);
		},
	},
	{
		name: "Target Nearest",
		when: () =>
			vCurrentTarget !== vNearestTarget &&
			vNearestTarget?.type === "monster" &&
			vAttackMode &&
			(vCurrentTarget?.hp <= 0 || vCurrentTarget===null || !is_in_range(vCurrentTarget)),
		do: () => {
			log("Targeting Nearest");
			change_target(vNearestTarget);
		},
	}
	];
	
	for (const { when, do: action} of actions) {
		if (when()) {
			action();
			break;
		}
	}
}

// Attack Loop
async function aAttackLoop() {
    try {

		if(!(vHelpMode||vAttackMode) || character.rip || is_moving(character)||!can_attack(vCurrentTarget)||!(vCurrentTarget.type==="monster")){
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
    setTimeout(aAttackLoop, Math.max(1, ms_to_next_skill("attack")));
}

// Go To Function
async function aGoToTarget() {
	
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
}
// Loot Function
async function aLoot(){
	try{
	loot();
	} catch (e) {
		console.error(e);
	}
	setTimeout(aLoot, 250);
}


// Skill stuff

function aGetNameFromObject(object, value) {
  return Object.keys(object).find(key => object[key] === value) || null;
}

function aUseSkill(vSkill,vProtPrio) {
	const vSkillName=aGetNameFromObject(G.skills,vSkill);
	if(is_on_cooldown(vSkillName)){return;}
	if(!(vAttackMode||vHelpMode)){return;}
	set_message(vSkill.name);
	if(vProtPrio===true&&vProtectTarget!==undefined){
		log(vSkill.name+" on ProtectTarget");
		use_skill(vSkillName,vProtectTarget);
	} else {
		log(vSkill.name+" on Target");
		use_skill(vSkillName,vCurrentTarget);
	}
}

function aUseAllyBuff(vBuff,vAlly){
	const vBuffName=aGetNameFromObject(G.skills,vBuff);
	const vCD=is_on_cooldown(vBuffName);
	const vAllyTarget=get_player(vAlly);
	const vAllyInRange=is_in_range(vAllyTarget,vBuffName);
	let vAllyHasBuff;
	if(vAllyTarget&&vAllyInRange){
		if(character.rip || is_moving(character)) {
		} else if(vCD==true){
			set_message(vBuff.name+" on CD","Grey");
		} else {
			vAllyHasBuff=vAllyTarget.s[vBuffName] ? true : false;
			if(!vAllyHasBuff){
				set_message(vBuff.name,"Orange");
				use_skill(vBuffName,vAllyTarget);
			}
		}
	}
}
