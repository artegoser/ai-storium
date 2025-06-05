import { m } from './paraglide/messages';
import { getText, type Message } from './pollinations';
import { state } from './state.svelte';

export function system(content: string): Message {
	return {
		role: 'system',
		content: `SYSTEM_TIME=${new Date().toString()}. -1 health is INFINITE. ANSWER IN ${m.lang()}. ${content}`
	};
}

export function user(content: string): Message {
	return { role: 'user', content };
}

export async function simplePrompt(prompt: string): Promise<string> {
	console.log('Prompt:', prompt);
	console.log(cleanWhitespace(prompt));
	try {
		state.generating = true;
		const response = await getText([system(cleanWhitespace(prompt))]);

		console.log('Response:', response);

		return response;
	} finally {
		state.generating = false;
	}
}

export async function jsonPrompt(prompt: string): Promise<unknown> {
	return JSON.parse(await simplePrompt(prompt));
}

export function opt(msg: string, description: unknown) {
	return description ? `${msg}: "${JSON.stringify(description)}".` : '';
}

export function cleanWhitespace(input: string): string {
	return input.replace(/[\s]+/g, ' ').trim();
}
