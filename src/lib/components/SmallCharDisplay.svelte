<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Character } from '$lib/types';
	import AiImage from './AiImage.svelte';

	export let char: Character;
	export let hp: number;
</script>

<div class="flex flex-col items-start gap-2 border-2 max-sm:flex-col">
	{#key char.visualPrompt}
		<AiImage prompt={char.visualPrompt} className="w-full aspect-square" />
	{/key}
	<h3 class="text-xl font-bold">
		{char.name}
	</h3>
	<div class="flex flex-wrap gap-1">
		<div class="rounded-2xl bg-green-700 p-2">
			❤️ {char.max_hp >= 0 ? `${hp}/${char.max_hp}` : m.infinity()}
		</div>
		{#each char.abilities as ability}
			<div class="rounded-2xl bg-zinc-900 p-2">
				{ability}
			</div>
		{/each}
	</div>
</div>
