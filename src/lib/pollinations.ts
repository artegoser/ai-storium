import { image_base_url } from './config';

export interface ImageParams {
	prompt: string;
}

export function getImageSrc(p: ImageParams) {
	const { prompt, ...params } = p;
	const queryString = new URLSearchParams({ ...params, nologo: 'true' }).toString();
	return `${image_base_url}${encodeURIComponent(prompt)}${queryString ? '?' + queryString : ''}`;
}
