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

const RANK_ANYONE_LIST = {
	name: 'ranks',
	description: `Enter any number of connect code(s) to see their ranks`,
	type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
	"options": [
        {
            "name": "connect_code_1",
            "description": `A user's connect code`,
            "type": 3,
            "required": true,
        },
		{
            "name": "connect_code_2",
            "description": `A user's connect code`,
            "type": 3,
            "required": false,
        },
		{
            "name": "connect_code_3",
            "description": `A user's connect code`,
            "type": 3,
            "required": false,
        },
		{
            "name": "connect_code_4",
            "description": `A user's connect code`,
            "type": 3,
            "required": false,
        },
		{
            "name": "connect_code_5",
            "description": `A user's connect code`,
            "type": 3,
            "required": false,
        },
		{
            "name": "connect_code_6",
            "description": `A user's connect code`,
            "type": 3,
            "required": false,
        },
		{
            "name": "connect_code_7",
            "description": `A user's connect code`,
            "type": 3,
            "required": false,
        },
		{
            "name": "connect_code_8",
            "description": `A user's connect code`,
            "type": 3,
            "required": false,
        },
	]
};

const ALL_COMMANDS = [TEST_COMMAND,RANK_ANYONE,RANK_ANYONE_LIST];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);