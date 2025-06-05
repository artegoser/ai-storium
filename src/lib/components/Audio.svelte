<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import Spinner from './Spinner.svelte';
	import Button from './Button.svelte';
	import { autoplay_audio } from '$lib/config';

	let {
		getAudio,
		ariaLabel = m.audio(),
		className = ''
	}: {
		getAudio: () => Promise<Blob>;
		ariaLabel?: string;
		className?: string;
	} = $props();

	let loaded = $state(false);
	let error = $state(false);
	let audioUrl = $state<string | null>(null);
	let audioElement: HTMLAudioElement | undefined = $state();

	$effect(() => {
		let objectUrl: string | null = null;

		async function loadAudio() {
			try {
				const blob = await getAudio();
				objectUrl = URL.createObjectURL(blob);
				audioUrl = objectUrl;
				loaded = false;
				error = false;
			} catch (err) {
				console.error('Audio loading failed', err);
				error = true;
			}
		}

		loadAudio();

		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
				audioUrl = null;
			}
		};
	});

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

<div class="audio-container {className}">
	{#if audioUrl && !error}
		<audio
			bind:this={audioElement}
			autoplay={autoplay_audio}
			src={audioUrl}
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
				<Button on:click={retry}>🔃</Button>
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
