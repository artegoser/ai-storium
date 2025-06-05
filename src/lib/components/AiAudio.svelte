<script lang="ts">
	import { getAudio, getImageSrc } from '$lib/pollinations';
	import { system } from '$lib/utils';
	import { onMount } from 'svelte';
	import Audio from './Audio.svelte';
	import { state } from '$lib/state.svelte';
	import { autoplay_audio } from '$lib/config';

	export let className: string = '';
	export let prompt: string;
	export let autoplay: boolean = false;

	let src: string | undefined = undefined;

	onMount(async () => {
		src = state.audios[prompt] || URL.createObjectURL(await getAudio([system(prompt)]));
		state.audios[prompt] = src;
	});
</script>

<Audio
	className="rounded-2xl {className}"
	{src}
	ariaLabel={prompt}
	autoplay={autoplay && autoplay_audio}
/>
