import { image_base_url, text_base_url, text_model } from './config';
import { m } from './paraglide/messages';

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

export async function getText(messages: Message[]) {
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

export async function simplePrompt(prompt: string) {
	try {
		return await getText([system(prompt)]);
	} catch (e) {
		console.log(e);
		return m.generation_error();
	}
}
