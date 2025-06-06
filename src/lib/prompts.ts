import { m } from './paraglide/messages';

import { characters, event, setting, type Character, type Event, type Setting } from './types';
import { jsonPrompt, opt } from './utils';

const arena_game_description = 'a game that describes two characters clashing';

export function getSettingNarration(obj: unknown) {
	return `
	You're an observer of ${arena_game_description}. 
	You want spectacle and epic. You make sarcastic jokes. Now the player 
	has created a description of the world setting. You can poke fun and 
	laugh at the player, or on the contrary praise him. You can suggest 
	the player to change the plot if you don't like it. Speak directly to 
	the player as if you were in the same room with him. Comment the
	world setting: ${JSON.stringify(obj)}
	`;
}

export function getCharactersNarration(obj: unknown) {
	return `
	You're an observer of ${arena_game_description}. You want 
	spectacle and epic. You make sarcastic jokes. Now the player 
	has created a character description, the world setting 
	you've already described. You can poke fun and make fun 
	of the player, or you can praise him. You can suggest 
	the player to change the characters if you don't like 
	it. Speak directly to the player as if you were in the 
	same room with him. Comment only the 
	characters: ${JSON.stringify(obj)}
	`;
}

export function getEventNarration(obj: unknown) {
	return `
	You're an observer of ${arena_game_description}. You want 
	spectacle and epic. You make sarcastic jokes. Now the player 
	has created a character description, the world setting 
	you've already described. You can poke fun and make fun 
	of the player, or you can praise him. You can suggest 
	the player next move. Speak directly to the player as 
	if you were in the same room with him. Comment only the 
	last event: ${JSON.stringify(obj)}
	`;
}

export async function generateSetting(world: string, place: string) {
	return setting.parse(
		await jsonPrompt(`
			
			You have to generate a setting for ${arena_game_description}. Create a 
			well-developed world setting with lore.

			When describing the world, describe the entire universe 
			as a whole, not a specific place. For example: realistic, 
			cartoon, anime. 

			In descriptions, do not repeat the name of the world at 
			the beginning. And do not describe the characters. They 
			will be described in the next step.
			
			${[opt('World prompt', world), opt('Place prompt', place)].join(' ')}

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
		await jsonPrompt(`
			
			You have to generate a two characters for ${arena_game_description}.
			
			Setting: ${JSON.stringify(setting)}. 
			
			${[
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

export async function generateEvent(
	gameCharAction: string,
	oldEvents: Event[],
	gameCharacter: Character,
	enemyCharacter: Character,
	setting: Setting
) {
	return event.parse(
		await jsonPrompt(`

			World Setting: ${JSON.stringify(setting)}.
			
			Game character: ${JSON.stringify(gameCharacter)}.
			Enemy character: ${JSON.stringify(enemyCharacter)}.

			${opt('All previous events', oldEvents)}
			
			You have to generate an event for ${arena_game_description}.
			
			${opt('Game character action prompt', gameCharAction)}
			
			Answer STRICTLY in this JSON format:
			{
				"visualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH",
				"description": "Description in style that suits the world. What the game character did and how the enemy responded, on ${m.lang()}",
			
				"gameCharacterHp": new adjusted enemy health,
				"enemyCharacterHp": new adjusted enemy health

				// Write only if world or characters changed due to change of looks or events
				// Be SURE to UPDATE VISUAL PROMPTS if it has changed. For example, a character 
				// has changed clothes, or the world has become blood red.
				// You can change anything, name, description, max_hp and other parameters
				"update": {
					"setting": {*},
					"gameCharacter": {*},
					"enemyCharacter": {*}
				}
			}
		`)
	);
}
