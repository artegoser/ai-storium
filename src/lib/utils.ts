import { m } from './paraglide/messages';
import { getText, type Message } from './pollinations';
import { state } from './state.svelte';
import type { Character, Event, Setting } from './types';

export function calculateUpdated(
	setting: Setting,
	gameCharacter: Character,
	enemyCharacter: Character,
	events: Event[]
) {
	let newSetting = setting;
	let newGameChar = gameCharacter;
	let newEnemyChar = enemyCharacter;

	for (const event of events) {
		if (event.update) {
			newSetting = { ...newSetting, ...event.update.setting };
			newGameChar = { ...newGameChar, ...event.update.gameCharacter };
			newEnemyChar = { ...newEnemyChar, ...event.update.enemyCharacter };
		}
	}

	return {
		setting: newSetting,
		gameCharacter: newGameChar,
		enemyCharacter: newEnemyChar
	};
}

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
	console.log('Prompt:', trimIndent(prompt));
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
	return description ? `${msg.toUpperCase()}: ${JSON.stringify(description)}.` : '';
}

export function cleanWhitespace(input: string): string {
	return input.replace(/[\s]+/g, ' ').trim();
}

export function trimIndent(str: string) {
	if (str === '') return '';

	const lines = str.split('\n');

	while (lines.length > 0 && lines[0].trim() === '') {
		lines.shift();
	}

	while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
		lines.pop();
	}

	if (lines.length === 0) return '';

	let minIndent = Infinity;
	for (const line of lines) {
		if (line.trim() !== '') {
			let indent = 0;
			while (indent < line.length && line[indent].trim() === '') {
				indent++;
			}
			if (indent < minIndent) minIndent = indent;
		}
	}

	minIndent = minIndent === Infinity ? 0 : minIndent;

	return lines.map((line) => line.substring(minIndent)).join('\n');
}
