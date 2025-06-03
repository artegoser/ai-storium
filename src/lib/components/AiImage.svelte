<script lang="ts">
	import { getImageSrc } from '$lib/pollinations';
	import Image from './Image.svelte';

	export let className: string = '';
	export let prompt: string;
</script>

<Image src={getImageSrc({ prompt })} alt={prompt} className="rounded-2xl {className}" />
