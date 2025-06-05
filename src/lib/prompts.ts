import { m } from './paraglide/messages';

import { characters, setting, type Setting } from './types';
import { jsonPrompt, opt } from './utils';

export async function generateSetting(world: string, place: string) {
	return setting.parse(
		await jsonPrompt(`You have to generate a setting for a game. Create a well-developed world setting with lore${world !== '' || place !== '' ? ` based on the provided short description` : ''}. When describing the world, describe the entire universe as a whole, not a specific place. Consider the style of the world when writing a visual prompt. For example: realistic, cartoon, anime. ${[opt('World short description', world), opt('Place short description', place)].join(' ')}
Answer STRICTLY in this JSON format:
{
    "worldName": "if not provided generate on ${m.lang()}"
    "worldDescription": "on ${m.lang()}",
    "worldVisualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH",
    
    "placeName":"if not provided generate on ${m.lang()}",
    "placeDescription": "on ${m.lang()}",
    "placeVisualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH"
}`)
	);
}

export async function generateCharacters(
	game_char_description: string,
	enemy_char_description: string,
	setting: Setting
) {
	return characters.parse(
		await jsonPrompt(`You have to generate a two characters for a game where the intersection of two opponents is described. Consider the visual style of the world setting. ${game_char_description !== '' || enemy_char_description !== '' ? 'Create a character based on the provided description.' : ''} Setting: ${JSON.stringify(setting)}. ${[opt('Game character short description', game_char_description), opt('Enemy character short description', enemy_char_description)].join(' ')}.
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
}`)
	);
}
