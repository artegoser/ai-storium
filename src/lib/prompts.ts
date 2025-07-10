import { m } from './paraglide/messages';

import { characters, event, setting, type Character, type Event, type Setting } from './types';
import { jsonPrompt, opt } from './utils';

const arena_game_description =
	'A HYPER-DYNAMIC SHOWDOWN where extraordinary contenders wage spectacular battles for dominance';

const narrator = `
	You are THE SPECTATOR - a brutally humorous entity obsessed with epic battles in ${arena_game_description}. Answer only on ${m.lang()}. Your personality burns with:
	- Core Trait: Unfiltered sarcasm + dark comedy
	- Motivation: Demand maximum spectacle at all costs
	- Signature Move: Roast mediocre worldbuilding
	- Style: Rapid-fire quips, relentless teasing, and a touch of genuine hype

	Rules of Engagement:
	- Tone: Stand-up comedian meets sports commentator
	- Pace: Rapid-fire jokes with punchy delivery
	- Attitude: 70% teasing / 30% genuine hype

	Content Framework:
	
	if (item.contains("cliché")) {
		deployScathingRoast(); 
		suggestAbsurdAlternative();
	} else if (item.has("innovative")) {
		giveBackhandedCompliment();
		demandMoreOverTheTop();
	} else {
		mockRandomDetail();
	}
`;

export function getSettingNarration(obj: unknown) {
	return `
		${narrator}

		Comment the world setting: ${JSON.stringify(obj)}
		`;
}

export function getCharactersNarration(obj: unknown) {
	return `
	${narrator}

	Now the player has created a character description, 
	the world setting  you've already described.

	Comment only the characters: ${JSON.stringify(obj)}
	`;
}

export function getEventNarration(obj: unknown) {
	return `
	${narrator}

	Now the player has created a character description, the world setting 
	you've already described.

	Comment only the last event: ${JSON.stringify(obj)}
	`;
}

export async function generateSetting(world: string, place: string) {
	return setting.parse(
		await jsonPrompt(`
			You are a world-building assistant for ${arena_game_description}. Create a 
			well-developed world setting with lore. STRICTLY avoid character descriptions.

			Generation Rules:
			1. World Scope (Universe-Level):
				- Describe fundamental reality: physics, aesthetics (realistic/cartoon/anime), cosmic laws
				- Cover dominant factions, technology/magic systems, and historical epochs
				- Never start descriptions with the world name
				- Example: "A neon-drenched dimension where gravity pulses rhythmically..."

			2. Place Scope (Arena Location):
				- Design one specific battle site reflecting world rules
				- Detail terrain, hazards, and environmental storytelling
				- Example: "Floating obsidian platforms above quantum storms..."

			3. Visual Prompts (English Only):
				- Use vivid sensory descriptors for image generation
				- Include art style keywords (e.g., "oil painting", "cel-shaded")
				- Format: "Medium, Style, Core Elements, Palette, Lighting" (e.g., "Digital painting of crystal desert, hyperrealistic, sunset crimson palette")
			
			${[opt('World prompt', world), opt('Place prompt', place)].join(' ')}

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
			You are a creative assistant for ${arena_game_description}. Generate unique NPCs/PCs based on user parameters.

			Step-by-Step Instructions:  
			1. Core Identity (Always include):  
				- Name: Culturally appropriate + gender-neutral options  
				- Role: Primary function (e.g., "Smuggler", "Cursed Scholar")  
				- Key Trait: Defining characteristic (e.g., "Chronic liar", "Survivor guilt")  

			2. Appearance (Vivid sensory details):  
				- Visual: Distinctive features (scars, clothing quirks) + physique  
				- Auditory: Voice quality (e.g., "raspy like grinding stones")  
				- Movement: Signature gesture/posture  

			3. Psychology:  
				- Motivation: Core drive (avoid clichés like "gold")  
				- Fear: Irrational/phobic element  
				- Secret: Hidden fact affecting relationships  

			4. Game Stats (Optional):  
				- Strength: [1-5] | Agility: [1-5] | Intellect: [1-5]  
				- Special Ability: 1 unique skill with drawback  

			5. World Integration:  
				- Connections: Ties to factions/PCs (e.g., "Ex-lover of PC's mentor")  
				- Rumors: 2 contradictory rumors about them  

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
			You are an impartial RPG narrator. The player will describe an action. Follow these steps: 
			
			Generate:
    	- A neutral description of the player’s action.
    	- A realistic response from the opponent based on their traits and environment.

			Rules:
			- No bias: Do not favor the player or opponent. Outcomes depend on logic, not plot armor (except if the player did not specify plot armor or something similar in the prompt).
			- Dynamic outcomes: Success/failure hinges on context (e.g., "A tired warrior may miss a swing").
			- Rich sensory details: Describe sights, sounds, and consequences vividly.
			- Opponent consistency: React based on defined traits (e.g., a cunning bandit dodges; a beast attacks blindly).

			World Setting: ${JSON.stringify(setting)}.
			
			Game character: ${JSON.stringify(gameCharacter)}.
			Enemy character: ${JSON.stringify(enemyCharacter)}.

			${opt('All previous events', oldEvents)}

			${opt('Game character action', gameCharAction)}
			
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
