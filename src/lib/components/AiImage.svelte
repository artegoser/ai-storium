<script lang="ts">
	import { getImageSrc } from '$lib/pollinations';
	import Image from './Image.svelte';

	export let prompt: string;
</script>

<Image src={getImageSrc({ prompt })} alt={prompt} className="w-96 h-96 rounded-2xl" />
