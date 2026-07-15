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

export async function GetMultiplePlayersFromConnectCodeArgument(args){
	try{
		const api = new SlippiAPI();
		//const codes = args.map(({ value }) => ({ value }))
		const codes = [];
		for (let i = 0; i < args.length; i++){
			codes.push(args[i].value);
		}
		console.log(args)
		console.log(codes)
		const players = await api.getPlayers(codes)
		console.log(players)
		console.log(`\n\nbreak\n\n`)
		console.log(players[0])
		return players;
	}
	catch (e){
		console.log(e)
		throw e;
	}
}