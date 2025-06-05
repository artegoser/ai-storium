<script lang="ts">
	import { getAudio, getImageSrc } from '$lib/pollinations';
	import { system } from '$lib/utils';
	import Audio from './Audio.svelte';

	export let className: string = '';
	export let prompt: string;
</script>

<Audio
	className="rounded-2xl {className}"
	getAudio={async () => {
		return await getAudio([system(prompt)]);
	}}
	ariaLabel={prompt}
/>
