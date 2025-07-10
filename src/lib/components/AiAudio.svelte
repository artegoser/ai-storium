<script lang="ts">
	import { getAudio } from '$lib/pollinations';
	import { system } from '$lib/utils';
	import { onMount } from 'svelte';
	import { state as appState } from '$lib/state.svelte';
	import { autoplay_audio } from '$lib/config';
	import { m } from '$lib/paraglide/messages';
	import Spinner from './Spinner.svelte';
	import Button from './Button.svelte';
	import { slide } from 'svelte/transition';

	let {
		className = '',
		prompt,
		autoplay = false
	}: {
		className?: string;
		prompt: string;
		autoplay?: boolean;
	} = $props();

	let src = $state<string | undefined>(undefined);
	let loaded = $state(false);
	let error = $state(false);
	let audioElement: HTMLAudioElement | undefined = $state();

	function retry() {
		error = false;
		loaded = false;
		src = undefined;
		loadAudio();
	}

	async function loadAudio() {
		try {
			if (appState.audios[prompt]) {
				src = appState.audios[prompt];
				return;
			}

			const audioBlob = await getAudio([system(prompt)]);
			src = URL.createObjectURL(audioBlob);
			appState.audios[prompt] = src;
		} catch (err) {
			console.error('Error loading audio:', err);
			error = true;
		}
	}

	onMount(() => {
		loadAudio();

		if (audioElement?.readyState && audioElement.readyState >= 3) {
			loaded = true;
		}
	});
</script>

<div class="audio-container rounded-2xl {className}" transition:slide>
	{#if src && !error}
		<audio
			bind:this={audioElement}
			autoplay={autoplay && autoplay_audio}
			{src}
			aria-label={prompt}
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
		{:else if !loaded && !error && !error}
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
