// NPC Map List
// Main Map
const vExchangeNo=1 


let vNPCSpot
let vNPCPOS
let vNPCDistance
let vNPCNo=vExchangeNo
let vNPCName=G.npcs[vNPC].name


async function mExchange(){
	try{
		mNPCLocation(vNPCNo)
		if(vNPCDistance>200){
			log("Not near NPC");
			await smart_move(find_npc(vNPC));
			mNPCLocation(vNPCNo)
		}
		if(vNPCDistance<200){
			interact(vNPC);
			log("Exchanging")
			vItemLocation=locate_item(vItem)
			let result = await exchange(vItemLocation);
				if (result.success) {
			console.log("Exchange succeeded:", result.reward);
			} 
		}
	} catch (e) {
		console.error(e);
	}
	setTimeout(mExchange, 250);
}




const vNPCInfoMain=G.maps.main.npcs

function mNPCLocation(vNPCNo){
	vNPCSpot =  vNPCInfoMain[vNPCNo];
	vNPCPOS = {x: vNPCSpot.position[0], y: vNPCSpot.position[1], map: "main" }
	vNPCDistance = distance(parent.character, vNPCPOS);
}

let vItemSlot;
let vQuantity;
let vItemName;

function mSell(vItem,vQuant){
	
	let vItemQuantity;
	vItemName = vItem;
	vQuantity=vQuant;
	vItemSlot=locate_item(vItem);
	if(character.items[vItemSlot]==null){return;}
	if(character.items[vItemSlot].q==undefined){
		vItemQuantity=1;
	} else {
		vItemQuantity=character.items[vItemSlot].q;
	}
	if(vItemQuantity>=1){
		log("Selling: " + vQuant + "x " +vItemName);
		mSellItems();
	}
}


async function mSellItems(){
	vItemSlot=locate_item(vItemName);
	set_message("Selling "+ vItemName);
	sell(vItemSlot,1);
	log("Sold 1x " +vItemName);
	vQuantity--;
	if(vQuantity>=1){
		setTimeout(mSellItems, 250);
	}
}

async function mMoveTo(vPlayerName){
	send_party_request(vPlayerName);
	while (character.party==null) {await sleep(250)}
	log("test")
	vPlayer=parent.party[vPlayerName];
	await smart_move(vPlayer);
}
