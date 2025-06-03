import { z } from 'zod';

export interface Character {
	name: string;
	description: string;
	visualPrompt: string;
	abilities: string[];
}

export const character = z.object({
	name: z.string(),
	description: z.string(),
	visualPrompt: z.string(),
	abilities: z.array(z.string())
});
