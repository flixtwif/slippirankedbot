import { SlippiAPI } from 'slippi-api';


export async function GetSinglePlayerFromConnectCodeArgument(code){
	try{
		const api = new SlippiAPI();
		const player = await api.getPlayer(code);
		return player;
	}
	catch (e){
		console.log(e)
		throw e;
	}
}

