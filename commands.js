import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const RANK_ANYONE = {
	name: 'rank',
	description: `Enter a connect code to see a user's rank`,
	type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
	"options": [
        {
            "name": "connect_code",
            "description": `The user's connect code`,
            "type": 3,
            "required": true,
            
        },
	]
};

const ALL_COMMANDS = [TEST_COMMAND,RANK_ANYONE];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);