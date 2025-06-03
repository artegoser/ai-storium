import { image_base_url, text_base_url, text_model } from './config';

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
	return await fetch(text_base_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ model: text_model, private: true, messages })
	}).then((v) => v.json());
}
