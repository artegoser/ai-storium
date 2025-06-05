<script lang="ts">
	import { getImageSrc } from '$lib/pollinations';
	import Image from './Image.svelte';

	export let className: string = '';
	export let prompt: string;

	export let width: number = 1024;
	export let height: number = 1024;
</script>

<Image
	src={getImageSrc({ prompt, width: width.toString(), height: height.toString() })}
	alt={prompt}
	className="rounded-2xl {className}"
/>
