import { audio_base_url, audio_voice, image_base_url, text_base_url, text_model } from './config';

export interface Message {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface ImageParams {
	prompt: string;
	width?: string;
	height?: string;
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
		await fetch(`${text_base_url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ model: text_model, private: true, seed: Math.random(), messages })
		}).then((v) => v.json())
	).choices[0].message.content;
}

export async function getAudio(messages: Message[]): Promise<Blob> {
	const binaryString = atob(
		(
			await fetch(`${audio_base_url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: 'openai-audio',
					modalities: ['text', 'audio'],
					audio: { voice: audio_voice, format: 'mp3' },
					private: true,
					messages
				})
			}).then((v) => v.json())
		).choices[0].message.audio.data
	);

	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	return new Blob([bytes], { type: 'audio/mpeg' });
}
