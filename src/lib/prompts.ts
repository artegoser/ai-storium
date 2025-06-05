import { m } from './paraglide/messages';

import { characters, setting, type Setting } from './types';
import { jsonPrompt, opt } from './utils';

export function getSettingNarration(obj: unknown) {
	return `
	You're an observer of a game that describes two characters clashing. 
	You want spectacle and epic. You make sarcastic jokes. Now the player 
	has created a description of the world setting. You can poke fun and 
	laugh at the player, or on the contrary praise him. Speak directly to 
	the player as if you were in the same room with him. Comment the
	world setting: ${JSON.stringify(obj)}
	`;
}

export function getCharactersNarration(obj: unknown) {
	return `
	You're an observer of a game that describes two characters 
	clashing. You want spectacle and epic. You make sarcastic 
	jokes. Now the player has created a character description, 
	the world setting you've already described. You can poke 
	fun and make fun of the player, or you can praise him.
	Speak directly to the player as if you were in the same 
	room with him. Comment only the 
	characters: ${JSON.stringify(obj)}
	`;
}

export async function generateSetting(world: string, place: string) {
	return setting.parse(
		await jsonPrompt(`
			You have to generate a setting for a game. Create a 
			well-developed world setting with lore 
			${world !== '' || place !== '' ? `based on the provided prompt` : ''}. 
			When describing the world, describe the entire universe 
			as a whole, not a specific place. For example: realistic, 
			cartoon, anime. ${[opt('World prompt', world), opt('Place prompt', place)].join(' ')}
			Answer STRICTLY in this JSON format:
			{
				"worldName": "if not provided generate on ${m.lang()}"
				"worldDescription": "on ${m.lang()}",
				"worldVisualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH",
				
				"placeName":"if not provided generate on ${m.lang()}",
				"placeDescription": "on ${m.lang()}",
				"placeVisualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH"
			}
		`)
	);
}

export async function generateCharacters(
	game_char_description: string,
	enemy_char_description: string,
	setting: Setting
) {
	return characters.parse(
		await jsonPrompt(`You have to generate a two characters for a 
			game where the intersection of two opponents is described. 
			${game_char_description !== '' || enemy_char_description !== '' ? 'Create a character based on the provided prompts.' : ''} 
			Setting: ${JSON.stringify(setting)}. ${[
				opt('Game character prompt', game_char_description),
				opt('Enemy character prompt', enemy_char_description)
			].join(' ')}.
			Answer STRICTLY in this JSON format:
			{
			"gameCharacter": {
				"name": "if not provided generate on ${m.lang()}",
				"description": "appropriate description, on ${m.lang()}",
				"max_hp": max health in number (for ordinary human it is 100, for ultron in vibranium it is 1k, -1 for infinite (like deadpool)),
				"visualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH",
				"abilities": [list of abilities (only short names) of character for use in battle, on ${m.lang()}]
			},
			"enemyCharacter": "same scheme as game character"
			}
		`)
	);
}
