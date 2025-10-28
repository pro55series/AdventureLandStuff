// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!



// Variables Rearding Auto Attack
const vMinXP=0;
const vMaxAtt=9999;
let vType="boar";

// Items
const vHPPotionName="hpot1";
const vMPPotionName="mpot1";
let vHPPotionValue
let vMPPotionValue

// Support Info
const vSupportName="RoseMoth";
let vSupportDistance;

// Skill Variables
vTaunt=G.skills.taunt;
vCharge=G.skills.charge;
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
MapToggle("R", "vAttackMode");
MapToggle("T", "vHelpMode");
MapToggle("G", "vFollow");
// Press R to toggle vAttackModeget_target_of(entity)

fUseHPPotion();
fUseMPPotion();
fUseHPRegen();
fUseMPRegen();

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
	
	fFollow("RoseMoth");
	
	// Potions / Regen
	
	aSelectTarget("RoseMoth");
	aSelectTarget("KojiKuru");
	aSelectTarget("RegalMoth");
	aGoToTarget();
	if((get_target_of(vCurrentTarget)?.name=="Kojikisune")==false){
		aUseSkill(vTaunt,true);
		aUseSkill(vCharge,true);
	}
	
	
	//// Attack
	//fNextTarget();
	
	//fSkillOnAllyTargeted(vSupportName,vCharge);
	//fSkillOnAllyTargeted(vSupportName,vTaunt);
	//fSkillOnAllyTargeted("KojiKuru",vCharge);
	//fSkillOnAllyTargeted("KojiKuru",vTaunt);
	

	
	



},1000/4); // Loops every 1/4 seconds.

// Learn Javascript: https://www.codecademy.com/learn/introduction-to-javascript
// Write your own CODE: https://github.com/kaansoral/adventureland
