import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';


import { GetSinglePlayerFromConnectCodeArgument, GetMultiplePlayersFromConnectCodeArgument } from './rank.js';

const app = express();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              
              content: `test`
            }
          ]
        },
      });
    }
	
	if (name === 'rank'){
		const code_query = data.options[0].value;
		const player = await GetSinglePlayerFromConnectCodeArgument(code_query).then(result =>
		{
			let elo = result.rankedProfile.ratingOrdinal.toFixed(2)
			let rank = result.getRank();
			let displayname = result.displayName;
			console.log("elo:", elo)
			console.log("rank:", rank)
			
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
				  flags: InteractionResponseFlags.IS_COMPONENTS_V2,
				  components: [
					{
					  type: MessageComponentTypes.TEXT_DISPLAY,
					  
					  content: `**${displayname}** (${code_query.toUpperCase()}): ${elo} (${rank})`
					}
				  ]
				},
			});
	  
		}).catch(err => {
			// got err
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
				  flags: InteractionResponseFlags.IS_COMPONENTS_V2,
				  components: [
					{
					  type: MessageComponentTypes.TEXT_DISPLAY,
					  
					  content: `An error occured. Are you sure "${code_query}" is a valid connect code?`
					}
				  ]
				},
			});
		});
	  
	  
	  
	}
	
	if (name === 'ranks'){ // maybe can order ranks by elo in the future
		const { token, application_id } = req.body;
		const code_query = data.options;
		let str = "";
		
		res.send({
			type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
		});
		
		
		try {
			const result = await GetMultiplePlayersFromConnectCodeArgument(code_query);
			for (let i = 0; i < result.length; i++){
				let elo = result[i].rankedProfile.ratingOrdinal.toFixed(2);
				let rank = result[i].getRank();
				let displayname = result[i].displayName;
				let connectCode = result[i].connectCode;
				console.log("elo:", elo)
				console.log("rank:", rank)
				str += `${i}. **${displayname}** (${connectCode}): ${elo} (${rank})\n`;
			}
			await fetch(
				`https://discord.com/api/v10/webhooks/${application_id}/${token}/messages/@original`, 
				{
					method: "PATCH",
					headers: {
						"Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						content: `${str}`
					})
				}
			);
		} catch (err) {
			await fetch(`https://discord.com/api/v10/webhooks/${application_id}/${token}/messages/@original`, 
				{
					method: "PATCH",
					body: JSON.stringify({
						content: `An error occured.`
					})
				}
			);
		}
		
		return;
	  
	}

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});