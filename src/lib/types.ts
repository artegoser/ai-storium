import { z } from 'zod';

export type Character = z.infer<typeof character>;
export const character = z.object({
	name: z.string(),
	description: z.string(),
	max_hp: z.number(),
	visualPrompt: z.string(),
	abilities: z.array(z.string())
});

export type Characters = z.infer<typeof characters>;
export const characters = z.object({
	gameCharacter: character,
	enemyCharacter: character
});

export const setting = z.object({
	worldName: z.string(),
	worldDescription: z.string(),
	worldVisualPrompt: z.string(),

	placeName: z.string(),
	placeDescription: z.string(),
	placeVisualPrompt: z.string()
});
export type Setting = z.infer<typeof setting>;

export const update = z
	.object({
		setting: setting.partial(),
		gameCharacter: character.partial(),
		enemyCharacter: character.partial()
	})
	.partial()
	.optional();
export type Update = z.infer<typeof update>;

export const event = z.object({
	visualPrompt: z.string(),
	description: z.string(),

	gameCharacterHp: z.number(),
	enemyCharacterHp: z.number(),

	update
});
export type Event = z.infer<typeof event>;
