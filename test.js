import { SlippiAPI } from 'slippi-api';

const api = new SlippiAPI();
const player = await api.getPlayer('ywy#474');

if (player) {
  console.log(player.toString());
}