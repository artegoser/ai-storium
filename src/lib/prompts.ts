import { m } from './paraglide/messages';
import { jsonPrompt } from './pollinations';
import { character, setting, type Character } from './utils';

export async function generateSetting(world: string, place: string) {
	return setting.parse(
		await jsonPrompt(`You have to generate a setting for a game where fights between characters take place. Create a unique world setting with lore${world !== '' && place !== '' ? ' and based on the provided short description' : ''}. World description: ${world}. ${place === '' ? '' : `Place short description: ${place}.`}
Answer STRICTLY in this JSON format:
{
    "worldName": "Creative name, on ${m.lang()}"
    "worldDescription": "Intriguing description, on ${m.lang()}",
    "worldVisualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH",
    
    "placeName":"Creative name, on ${m.lang()}",
    "placeDescription": "Intriguing description, on ${m.lang()}",
    "placeVisualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH"
}`)
	);
}

export async function generateCharacter(
	description: string,
	world: string,
	place: string,
	enemy?: Character
) {
	return character.parse(
		await jsonPrompt(`You have to generate a character for a game where fights between characters take place. Create a unique character for the based on the provided description. World description: ${world}. Place description: ${place}. ${description !== '' ? ` Character short description: ${description}` : ''}${enemy ? ` Enemy of this character: ${JSON.stringify(enemy)}` : ''}
Answer STRICTLY in this JSON format:
{
		"name": "Creative name, on ${m.lang()}",
		"description": "Intriguing description, on ${m.lang()}",
		"max_hp": max health in number (for human it is 100),
		"visualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH",
		"abilities": [list of abilities (only short names) of character for use in battle, on ${m.lang()}]
}`)
	);
}
