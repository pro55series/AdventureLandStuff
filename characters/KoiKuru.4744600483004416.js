// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!



// Variables Rearding Auto Attack
const vMinXP=0;
const vMaxAtt=99999;
let vType="iceroamer";

//Potion Variable Setup
let vMPPotionValue
let vHPPotionValue

// Items
const vHPPotionName="hpot1";
const vMPPotionName="mpot1";

// Support Info
const vSupportName="";
let vSupportDistance;

// Skill Variables
vInvis=G.skills.invis
vSpeedBuff=G.skills.rspeed
// Load External Code Block
load_code(1);
load_code(3);



// Toggle Hell

//MapTest("E",vEXAMPLE)
//MapTest("R",vAttackMode)
// ----------------------
// Example usage
// ----------------------
//MapToggle("E", "vEXAMPLE");         // Press E to toggle vEXAMPLE
MapToggle("R", "vAttackMode");   // Press R to toggle vAttackModeget_target_of(entity)
MapToggle("T", "vHelpMode");
MapToggle("G", "vFollow");

// External Loops


// Potions / Regen
fUseHPRegen();
fUseMPRegen();
fUseHPPotion();
fUseMPPotion();

// Attack
aAttackLoop();
aLoot();
fGoToMonster(vType);

// Start Character Loop
setInterval(function(){
	
	//set potion values for future function use
	vHPPotionValue=fFindPotionValue(vHPPotionName);
	vMPPotionValue=fFindPotionValue(vMPPotionName);
	
	// Functions
	
	// Support Info
	vSupportDistance=fSupportDistance(vSupportName);	
	


	
	fFollow("Kojikisune");
	
	// Attack
	aSelectTarget("Kojikisune");
	aGoToTarget();

	//fSkillOnAllyTargeted(vSupportName,vTaunt);
	aUseAllyBuff(vInvis,"KojiKuru");
	//fUseSkill(vMBurst);
	aUseAllyBuff(vSpeedBuff,"KojiKuru");
	aUseAllyBuff(vSpeedBuff,"Kojikisune");
	aUseAllyBuff(vSpeedBuff,"RoseMoth");
	aUseAllyBuff(vSpeedBuff,"RegalMoth");

},1000/4); // Loops every 1/4 seconds.

// Learn Javascript: https://www.codecademy.com/learn/introduction-to-javascript
// Write your own CODE: https://github.com/kaansoral/adventureland
