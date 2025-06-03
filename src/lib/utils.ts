import { z } from 'zod';

export interface Character {
	name: string;
	description: string;
	max_hp: number;
	visualPrompt: string;
	abilities: string[];
}

export const character = z.object({
	name: z.string(),
	description: z.string(),
	max_hp: z.number(),
	visualPrompt: z.string(),
	abilities: z.array(z.string())
});
