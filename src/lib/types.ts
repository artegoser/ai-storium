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
