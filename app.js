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


import { GetSinglePlayerFromConnectCodeArgument } from './rank.js';

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
			console.log("hi")
			let elo = result.rankedProfile.ratingOrdinal.toFixed(2)
			let rank = result.getRank();
			console.log(elo, rank)
			
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
				  flags: InteractionResponseFlags.IS_COMPONENTS_V2,
				  components: [
					{
					  type: MessageComponentTypes.TEXT_DISPLAY,
					  
					  content: `${elo} (${rank})`
					}
				  ]
				},
			});
	  
		}).catch(err => {
			// got err
		});
	  
	  
	  
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