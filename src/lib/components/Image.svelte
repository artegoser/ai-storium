<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import Spinner from './Spinner.svelte';

	let {
		src,
		alt = m.image(),
		className = ''
	}: { src: string; alt?: string; className?: string } = $props();

	let loaded = $state(false);
	let error = $state(false);

	let imgElement: HTMLImageElement | undefined = $state();

	onMount(() => {
		// Check if image is already cached
		if (imgElement?.complete) {
			loaded = true;
		}
	});
</script>

<div class="image-container {className}">
	{#if !error}
		<img
			bind:this={imgElement}
			{src}
			{alt}
			class="image"
			class:loaded
			onload={() => (loaded = true)}
			onerror={() => (error = true)}
			style="opacity: {loaded ? 1 : 0}; "
		/>
	{/if}

	<div class="status-container">
		{#if error}
			<div class="error-message">
				⚠️ {m.failed_image()}
			</div>
		{:else if !loaded && !error}
			<Spinner />
			<div class="text-center">
				{m.generating_image()}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	.image-container {
		@apply relative flex flex-col items-center justify-center overflow-hidden bg-zinc-900;
		@apply text-center text-2xl font-bold;
	}

	.status-container {
		@apply absolute flex flex-col items-center justify-center;
	}
	.image {
		@apply object-cover transition-opacity duration-300 ease-in;
	}

	.error-message {
		@apply p-4;
		color: #ffb657;
	}
</style>
