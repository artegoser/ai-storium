<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import Spinner from './Spinner.svelte';
	import Button from './Button.svelte';
	import { slide } from 'svelte/transition';

	let {
		src,
		ariaLabel = m.audio(),
		className = '',
		autoplay = false
	}: {
		src: string | undefined;
		ariaLabel?: string;
		className?: string;
		autoplay?: boolean;
	} = $props();

	let loaded = $state(false);
	let error = $state(false);
	let audioElement: HTMLAudioElement | undefined = $state();

	function retry() {
		error = false;
		if (audioElement) {
			audioElement.load();
		}
	}

	onMount(() => {
		if (audioElement?.readyState && audioElement.readyState >= 3) {
			loaded = true;
		}
	});
</script>

<div class="audio-container {className}" transition:slide>
	{#if src && !error}
		<audio
			bind:this={audioElement}
			{autoplay}
			{src}
			aria-label={ariaLabel}
			class="audio"
			class:loaded
			oncanplay={() => (loaded = true)}
			onerror={() => (error = true)}
			controls
		></audio>
	{/if}

	<div class="status-container">
		{#if error}
			<div class="error-message">
				⚠️ {m.failed_audio()}
				<Button onclick={retry}>🔃</Button>
			</div>
		{:else if !loaded && !error}
			<Spinner />
			<div class="text-center">
				{m.generating_audio()}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	.audio-container {
		@apply relative flex flex-col items-center justify-center overflow-hidden bg-zinc-900;
		@apply text-center text-2xl font-bold;
		min-height: 80px;
	}

	.status-container {
		@apply absolute flex items-center justify-center gap-2;
	}

	.audio {
		@apply w-full transition-opacity duration-300 ease-in;
		opacity: 0;
	}

	.audio.loaded {
		opacity: 1;
	}

	.error-message {
		@apply p-4;
		color: #ffb657;
	}
</style>
