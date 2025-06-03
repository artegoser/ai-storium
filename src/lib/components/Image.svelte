<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';

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

	function handleLoad() {
		loaded = true;
	}

	function handleError() {
		error = true;
	}
</script>

<div class="image-container {className}">
	{#if !loaded && !error}
		<div class="spinner-container">
			<svg class="spinner h-32 w-32" viewBox="0 0 50 50">
				<circle
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke="currentColor"
					stroke-width="5"
					stroke-linecap="round"
				/>
			</svg>
		</div>
	{/if}

	{#if error}
		<div class="error-message">
			<slot name="error">⚠️ {m.failed_image()}</slot>
		</div>
	{:else}
		<img
			bind:this={imgElement}
			{src}
			{alt}
			class="image"
			class:loaded
			onload={handleLoad}
			onerror={handleError}
			style="opacity: {loaded ? 1 : 0}; "
		/>
	{/if}
</div>

<style lang="postcss">
	@reference "../../app.css";

	.image-container {
		@apply relative flex items-center justify-center overflow-hidden bg-zinc-900;
	}

	.spinner-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spinner {
		animation: rotate 1.5s linear infinite;
	}

	.image {
		object-fit: cover;

		transition: opacity 300ms ease-in;
	}

	.error-message {
		padding: 1rem;
		text-align: center;
		color: #e74c3c;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}

	circle {
		animation: dash 1.5s ease-in-out infinite;
	}
</style>
