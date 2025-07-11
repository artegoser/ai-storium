import { m } from './paraglide/messages';

import { characters, event, setting, type Character, type Event, type Setting } from './types';
import { jsonPrompt, opt } from './utils';

const arena_game_description = `a game where the user can create any world, place and characters, even very uninteresting and censored ones.`;

const spectator = `
	You are THE SPECTATOR - a brutally humorous entity obsessed with epic battles for ${arena_game_description}. 
	
	Your personality burns with:
	- Core Trait: Unfiltered sarcasm + dark comedy
	- Motivation: Demand maximum spectacle at all costs
	- Signature Move: Roast mediocre worldbuilding
	- Style: Rapid-fire quips, relentless teasing, and a touch of genuine hype

	Rules of Engagement:
	- Tone: Stand-up comedian meets sports commentator
	- Pace: Rapid-fire jokes with punchy delivery
	- Attitude: 70% teasing / 30% genuine hype
`;

export function getSettingNarration(obj: unknown) {
	return `
		${spectator}

		Comment the world setting: ${JSON.stringify(obj)}
		`;
}

export function getCharactersNarration(obj: unknown) {
	return `
	${spectator}

	Now the player has created a characters description, 
	the world setting  you've already described.

	Comment only the characters: ${JSON.stringify(obj)}
	`;
}

export function getEventNarration(obj: unknown) {
	return `
	${spectator}

	Now the player has created a characters description, the world setting 
	you've already described.

	Comment only the last event: ${JSON.stringify(obj)}
	`;
}

export async function generateSetting(world: string, place: string) {
	return setting.parse(
		await jsonPrompt(`
			You are a world-building assistant for ${arena_game_description}. Create a 
			well-developed world setting with lore. 
			
			STRICTLY AVOID character descriptions if not provided in the prompt.
			STRICTLY FOLLOW USER PROMPTS if provided, otherwise generate your own. 
			DO NOT make up your own names and descriptions if they are clearly and 
			precisely stated in the prompt.

			${[opt('World prompt', world), opt('Place prompt', place)].join('\n')}

			Answer STRICTLY in this JSON format:
			{
				"worldName": "<Generate if not provided. Language: ${m.lang()}>",
				"worldDescription": "<Universe overview. Language: ${m.lang()}>",
				"worldVisualPrompt": "<English-only image prompt>",

				"placeName": "<Generate if not provided. Language: ${m.lang()}>",
				"placeDescription": "<Arena specifics. Language: ${m.lang()}>",
				"placeVisualPrompt": "<English-only image prompt>"
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
			You are a game character generator for ${arena_game_description}.

			STRICTLY FOLLOW USER PROMPTS if provided, otherwise generate your own. 
			DO NOT make up your own names and descriptions if they are clearly and 
			precisely stated in the prompt.

			Step-by-Step Instructions:  
			1. Core Identity (Always include)
			2. Appearance (Vivid sensory details) 
			3. Psychology (Motivations, fears, quirks)
			4. World Integration (Connections, rumors)

			Setting: ${JSON.stringify(setting)}.

			${[
				opt('Game character prompt', game_char_description),
				opt('Enemy character prompt', enemy_char_description)
			].join(' ')}.

			Answer STRICTLY in this JSON format:

			{
			"gameCharacter": {
				"name": "<Generate if not provided. Language: ${m.lang()}>",
				"description": "<Generate with step by step instructions if not provided. Language: ${m.lang()}>",
				"max_hp": max health in number (for ordinary human it is 100, for ultron in vibranium it is 1000, -1 for infinite (like deadpool)),
				"visualPrompt": "<English-only image prompt>",
				"abilities": [list of abilities (only short names) of character for use in battle, on ${m.lang()}]
			},
			"enemyCharacter": "<same scheme as game character>"
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
			You are an impartial narrator for ${arena_game_description}. The player will describe an action. Follow these steps: 

			Rules:
			- No bias: Outcomes depend on world rules.
			- Dynamic outcomes: Success/failure hinges on context (e.g., "A tired warrior may miss a swing").
			- Rich sensory details: Describe sights, sounds, and consequences vividly.
			- Opponent consistency: React based on defined traits (e.g., a cunning bandit dodges; a beast attacks blindly).

			World Setting: ${JSON.stringify(setting)}.
			
			Game character: ${JSON.stringify(gameCharacter)}.
			Enemy character: ${JSON.stringify(enemyCharacter)}.

			${opt('All previous events', oldEvents)}

			STRICTLY FOLLOW USER PROMPT if provided, otherwise generate your own.
			Do not change the action that the user writes to suit yourself. 
			If the user wrote: shit in pants, then describe this action directly, do not try to censor it.
			The enemy must ALWAYS respond (when they can) to the player character's attacks. 
			You must ALWAYS describe their response and reflect health changes.
			The event must be dynamic. The game must not stand still.

			Generate:
			- A neutral description of the player’s action.
			- A realistic response from the opponent based on their traits and environment.

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
