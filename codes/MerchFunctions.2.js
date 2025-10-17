// NPC Map List
// Main Map

const vNPCInfoMain=G.maps.main.npcs

const vExchangeItems= [
	{name:"candy1",minQ:20,NPCNo:1,NPCName:"exchange",priority:1},
	{name:"candy0",minQ:20,NPCNo:1,NPCName:"exchange",priority:2},
	{name:"seashell",minQ:20,NPCNo:4,NPCName:"fisherman",priority:3}
];




function mNPCLocation(vNPCNo){
	let vNPCSpot
	let vNPCPOS
	vNPCSpot =  vNPCInfoMain[vNPCNo];
	vNPCPOS = {x: vNPCSpot.position[0], y: vNPCSpot.position[1], map: "main" }
	return(distance(parent.character, vNPCPOS));
}

function pickExchangeItem(){
	const vExchangeItemsSorted= [...vExchangeItems].sort((a, b)=> a.priority - b.priority);
	
	for (let item of vExchangeItemsSorted) {
		const loc = locate_item(item.name);
		if(loc === -1) continue;
		const slot = character.items[loc];
		if(!slot) continue;
		
		if ((slot.q ?? 0)>=item.minQ){
			return item;
		}
	}
	return null;
}

async function mExchange(){
	try{
		const itemToExchange = pickExchangeItem();
		if(!itemToExchange){
			return;
		}
		
		// check NPC distance
		let vNPCDistance = mNPCLocation(itemToExchange.NPCNo);
		if(vNPCDistance>200){
			log(`Not Near Exchange NPC${itemToExchange.NPCName}, moving...`);
			await smart_move(find_npc(vNPCInfoMain[itemToExchange.NPCNo].id));
			vNPCDistance = mNPCLocation(itemToExchange.NPCNo);
		}
		
		// Exchange is close enough
		if (vNPCDistance <= 200) {
			set_message(`Exchanging ${itemToExchange.name}`);
			await exchangeAll(itemToExchange);
		}
	} catch (e) {
		console.error("mExchange() error:", e);
	} finally {
		// keep looping every 250 ms 
		setTimeout(mExchange,1000);
	}
}

async function exchangeAll(item) {
  let loc = locate_item(item.name);
  if (loc === -1) return;

  let slot = character.items[loc];
  while (slot && slot.q > 0) {
	for (let i=0; i<Math.min(slot.q, 5); i++){
		const result = await exchange(loc);
		if (!result?.success) break; // stop if exchange fails
	}
	await sleep(100);
    slot = character.items[loc]; // update after each exchange
  }
}



// COPY TO THE character








//async function mExchange(){
//	try{
//		mNPCLocation(vNPCNo)
//		if(vNPCDistance>200){
//			log("Not near NPC");
//			await smart_move(find_npc(vNPC));
//			mNPCLocation(vNPCNo)
//		}
//		if(vNPCDistance<200){
//			interact(vNPC);
//			log("Exchanging")
//			vItemLocation=locate_item(vItem)
//			let result = await exchange(vItemLocation);
//				if (result.success) {
//			console.log("Exchange succeeded:", result.reward);
//			} 
//		}
//	} catch (e) {
//		console.error(e);
//	}
//	setTimeout(mExchange, 250);
//}
//
//
//
//let vItemSlot;
//let vQuantity;
//let vItemName;
//
//function mSell(vItem,vQuant){
//	
//	let vItemQuantity;
//	vItemName = vItem;
//	vQuantity=vQuant;
//	vItemSlot=locate_item(vItem);
//	if(character.items[vItemSlot]==null){return;}
//	if(character.items[vItemSlot].q==undefined){
//		vItemQuantity=1;
//	} else {
//		vItemQuantity=character.items[vItemSlot].q;
//	}
//	if(vItemQuantity>=1){
//		log("Selling: " + vQuant + "x " +vItemName);
//		mSellItems();
//	}
//}
//
//
//async function mSellItems(){
//	vItemSlot=locate_item(vItemName);
//	set_message("Selling "+ vItemName);
//	sell(vItemSlot,1);
//	log("Sold 1x " +vItemName);
//	vQuantity--;
//	if(vQuantity>=1){
//		setTimeout(mSellItems, 250);
//	}
//}
//
//async function mMoveTo(vPlayerName){
//	send_party_request(vPlayerName);
//	while (character.party==null) {await sleep(250)}
//	log("test")
//	vPlayer=parent.party[vPlayerName];
//	await smart_move(vPlayer);
//}
