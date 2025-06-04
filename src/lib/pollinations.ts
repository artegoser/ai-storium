import { image_base_url, text_base_url, text_model } from './config';
import { m } from './paraglide/messages';
import { state } from './state.svelte';

export interface Message {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface ImageParams {
	prompt: string;
}

export function getImageSrc(p: ImageParams) {
	const { prompt, ...params } = p;
	const queryString = new URLSearchParams({
		...params,
		nologo: 'true',
		private: 'true'
	}).toString();
	return `${image_base_url}${encodeURIComponent(prompt)}${queryString ? '?' + queryString : ''}`;
}

export async function getText(messages: Message[]): Promise<string> {
	return (
		await fetch(text_base_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ model: text_model, private: true, seed: Math.random(), messages })
		}).then((v) => v.json())
	).choices[0].message.content;
}

export function system(content: string): Message {
	return { role: 'system', content: `ANSWER IN ${m.lang()}. ${content}` };
}

export function user(content: string): Message {
	return { role: 'user', content };
}

export async function simplePrompt(prompt: string): Promise<string> {
	try {
		state.generating = true;
		const result = await getText([system(prompt)]);
		return result;
	} finally {
		state.generating = false;
	}
}

export async function jsonPrompt(prompt: string): Promise<unknown> {
	return JSON.parse(await simplePrompt(prompt));
}
